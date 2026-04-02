import { pool } from "../config/database";
import { Product } from "../types/product";

type ListFilters = {
  tamanho?: string;
  categoria?: string;
  ativo?: boolean;
  /** Texto livre (nome ou descrição, case-insensitive) */
  busca?: string;
};

type UpsertSizeInput = {
  tamanhoId: number;
  estoque: number;
};

type CreateProductInput = {
  nome: string;
  descricao: string;
  preco: number;
  imagens: string[];
  categoria: string;
  ativo: boolean;
  tamanhos: UpsertSizeInput[];
};

type UpdateProductInput = Partial<Omit<CreateProductInput, "tamanhos">> & {
  tamanhos?: UpsertSizeInput[];
};

function parseImagensRow(row: any): string[] {
  const raw = row.imagens;
  if (raw == null || raw === undefined) {
    return row.imagem ? [String(row.imagem)] : [];
  }
  if (Array.isArray(raw)) {
    return raw.filter((u: unknown) => typeof u === "string" && u.length > 0) as string[];
  }
  if (typeof raw === "string") {
    try {
      const j = JSON.parse(raw);
      return Array.isArray(j) ? j.filter((u: unknown) => typeof u === "string") : [];
    } catch {
      return row.imagem ? [String(row.imagem)] : [];
    }
  }
  return row.imagem ? [String(row.imagem)] : [];
}

function mapProductRows(rows: any[]): Product[] {
  const grouped = new Map<number, Product>();

  for (const row of rows) {
    if (!grouped.has(row.id)) {
      const imagens = parseImagensRow(row);
      const imagem = imagens[0] ?? (row.imagem ? String(row.imagem) : "");
      grouped.set(row.id, {
        id: row.id,
        nome: row.nome,
        descricao: row.descricao,
        preco: Number(row.preco),
        imagem,
        imagens: imagens.length > 0 ? imagens : imagem ? [imagem] : [],
        categoria: row.categoria,
        ativo: row.ativo,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        tamanhos: []
      });
    }

    if (row.tamanho_id) {
      grouped.get(row.id)?.tamanhos.push({
        sizeId: row.tamanho_id,
        sizeName: row.tamanho_nome,
        stock: row.estoque
      });
    }
  }

  return Array.from(grouped.values());
}

const baseSelect = `
  SELECT
    p.id,
    p.nome,
    p.descricao,
    p.preco,
    p.imagem,
    p.imagens,
    p.categoria,
    p.ativo,
    p.created_at,
    p.updated_at,
    t.id AS tamanho_id,
    t.nome AS tamanho_nome,
    pt.estoque
  FROM produtos p
  LEFT JOIN produto_tamanhos pt ON pt.produto_id = p.id
  LEFT JOIN tamanhos t ON t.id = pt.tamanho_id
`;

export const productRepository = {
  async list(filters: ListFilters): Promise<Product[]> {
    const conditions: string[] = [];
    const values: any[] = [];

    if (filters.ativo !== undefined) {
      values.push(filters.ativo);
      conditions.push(`p.ativo = $${values.length}`);
    }

    if (filters.categoria) {
      values.push(filters.categoria);
      conditions.push(`p.categoria = $${values.length}`);
    }

    if (filters.tamanho) {
      values.push(filters.tamanho);
      conditions.push(`t.nome = $${values.length}`);
    }

    const term = filters.busca?.trim();
    if (term) {
      values.push(`%${term}%`);
      conditions.push(`(p.nome ILIKE $${values.length} OR p.descricao ILIKE $${values.length})`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const query = `${baseSelect} ${whereClause} ORDER BY p.created_at DESC`;
    const { rows } = await pool.query(query, values);
    return mapProductRows(rows);
  },

  async findById(id: number): Promise<Product | null> {
    const { rows } = await pool.query(`${baseSelect} WHERE p.id = $1`, [id]);
    const products = mapProductRows(rows);
    return products[0] ?? null;
  },

  async create(data: CreateProductInput): Promise<Product> {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const cover = data.imagens[0];
      const imagensJson = JSON.stringify(data.imagens);
      const productResult = await client.query(
        `INSERT INTO produtos (nome, descricao, preco, imagem, imagens, categoria, ativo)
         VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7)
         RETURNING id`,
        [data.nome, data.descricao, data.preco, cover, imagensJson, data.categoria, data.ativo]
      );

      const productId = productResult.rows[0].id as number;
      for (const item of data.tamanhos) {
        await client.query(
          `INSERT INTO produto_tamanhos (produto_id, tamanho_id, estoque)
           VALUES ($1, $2, $3)
           ON CONFLICT (produto_id, tamanho_id)
           DO UPDATE SET estoque = EXCLUDED.estoque`,
          [productId, item.tamanhoId, item.estoque]
        );
      }
      await client.query("COMMIT");
      const product = await this.findById(productId);
      if (!product) throw new Error("Unable to create product");
      return product;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },

  async update(id: number, data: UpdateProductInput): Promise<Product | null> {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const current = await client.query("SELECT id FROM produtos WHERE id = $1", [id]);
      if (!current.rowCount) {
        await client.query("ROLLBACK");
        return null;
      }

      const keys = Object.keys(data).filter((k) => k !== "tamanhos");
      if (keys.length > 0) {
        let imagemVal: string | null = null;
        let imagensVal: string | null = null;
        if (data.imagens !== undefined) {
          imagensVal = JSON.stringify(data.imagens);
          imagemVal = data.imagens.length > 0 ? data.imagens[0] : null;
        }
        await client.query(
          `UPDATE produtos
           SET nome = COALESCE($1, nome),
               descricao = COALESCE($2, descricao),
               preco = COALESCE($3, preco),
               imagem = COALESCE($4, imagem),
               imagens = COALESCE($5::jsonb, imagens),
               categoria = COALESCE($6, categoria),
               ativo = COALESCE($7, ativo),
               updated_at = NOW()
           WHERE id = $8`,
          [
            data.nome ?? null,
            data.descricao ?? null,
            data.preco ?? null,
            imagemVal,
            imagensVal,
            data.categoria ?? null,
            data.ativo ?? null,
            id
          ]
        );
      }

      if (data.tamanhos) {
        for (const item of data.tamanhos) {
          await client.query(
            `INSERT INTO produto_tamanhos (produto_id, tamanho_id, estoque)
             VALUES ($1, $2, $3)
             ON CONFLICT (produto_id, tamanho_id)
             DO UPDATE SET estoque = EXCLUDED.estoque`,
            [id, item.tamanhoId, item.estoque]
          );
        }
      }

      await client.query("COMMIT");
      return this.findById(id);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },

  async remove(id: number): Promise<boolean> {
    const result = await pool.query("DELETE FROM produtos WHERE id = $1", [id]);
    return Boolean(result.rowCount);
  }
};
