import { pool } from "../config/database";

export type SizeRow = { id: number; nome: string };

export const sizeRepository = {
  async list(): Promise<SizeRow[]> {
    const { rows } = await pool.query<SizeRow>(
      `SELECT id, nome FROM tamanhos ORDER BY id`
    );
    return rows;
  }
};
