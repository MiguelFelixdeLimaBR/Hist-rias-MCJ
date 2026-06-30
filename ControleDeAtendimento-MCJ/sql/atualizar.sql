UPDATE Duvidas
SET resposta = 'Resposta enviada',
    status = 'respondida'
WHERE id = 1;

UPDATE Solicitacoes
SET resolvido = 1,
    status = 'concluída'
WHERE id = 1;