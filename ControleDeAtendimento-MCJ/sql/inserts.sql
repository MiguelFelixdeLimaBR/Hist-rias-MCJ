INSERT INTO Discentes (nome, idade, matricula, email, curso)
VALUES
('João', 20, '2024001', 'joao@email.com', 'ADS'),
('Maria', 22, '2024002', 'maria@email.com', 'ADS');

INSERT INTO Duvidas (nome, duvida)
VALUES
('João', 'Como solicitar declaração?'),
('Maria', 'Quando começa o semestre?');

INSERT INTO Solicitacoes (discente, matricula, titulo, causa)
VALUES
('João', '2024001', 'Declaração', 'Solicitação de declaração de matrícula'),
('Maria', '2024002', 'Histórico', 'Transferência');