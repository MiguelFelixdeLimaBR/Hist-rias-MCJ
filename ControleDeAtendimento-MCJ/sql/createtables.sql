CREATE TABLE Discentes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    idade INTEGER,
    matricula TEXT UNIQUE,
    email TEXT,
    curso TEXT,
    createdAt DATETIME,
    updatedAt DATETIME
);

CREATE TABLE Duvidas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    duvida TEXT,
    resposta TEXT DEFAULT 'Pendente',
    status TEXT NOT NULL DEFAULT 'pendente',
    createdAt DATETIME,
    updatedAt DATETIME
);

CREATE TABLE Solicitacoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    discente TEXT,
    matricula TEXT,
    titulo TEXT,
    causa TEXT,
    resolvido INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pendente',
    createdAt DATETIME,
    updatedAt DATETIME
);