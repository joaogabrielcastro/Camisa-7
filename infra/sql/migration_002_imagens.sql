-- Executar uma vez em bases já criadas (antes só existia `imagem`).
ALTER TABLE produtos ADD COLUMN IF NOT EXISTS imagens JSONB NOT NULL DEFAULT '[]'::jsonb;

UPDATE produtos
SET imagens = to_jsonb(ARRAY[imagem])
WHERE jsonb_array_length(imagens) = 0 AND imagem IS NOT NULL AND imagem <> '';
