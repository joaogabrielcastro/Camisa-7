CREATE TABLE IF NOT EXISTS produtos (
  id BIGSERIAL PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  descricao TEXT NOT NULL,
  preco NUMERIC(10,2) NOT NULL CHECK (preco >= 0),
  imagem TEXT NOT NULL,
  imagens JSONB NOT NULL DEFAULT '[]'::jsonb,
  categoria VARCHAR(80) NOT NULL DEFAULT 'camisa',
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tamanhos (
  id SMALLSERIAL PRIMARY KEY,
  nome VARCHAR(10) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS produto_tamanhos (
  id BIGSERIAL PRIMARY KEY,
  produto_id BIGINT NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,
  tamanho_id SMALLINT NOT NULL REFERENCES tamanhos(id) ON DELETE RESTRICT,
  estoque INTEGER NOT NULL DEFAULT 0 CHECK (estoque >= 0),
  UNIQUE (produto_id, tamanho_id)
);

CREATE INDEX IF NOT EXISTS idx_produtos_ativo ON produtos(ativo);
CREATE INDEX IF NOT EXISTS idx_produtos_categoria ON produtos(categoria);
CREATE INDEX IF NOT EXISTS idx_produto_tamanhos_produto_id ON produto_tamanhos(produto_id);
CREATE INDEX IF NOT EXISTS idx_produto_tamanhos_tamanho_id ON produto_tamanhos(tamanho_id);

INSERT INTO tamanhos (nome)
VALUES ('P'), ('M'), ('G'), ('GG')
ON CONFLICT (nome) DO NOTHING;
