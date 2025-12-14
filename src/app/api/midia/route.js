// app/api/midia/route.js
import { NextResponse } from 'next/server';
import database from '@/database/database'; 

// ID Fictício, ajuste se você tiver autenticação de usuário real
const MOCK_USER_ID = 1; 

// --- GET: Listar todas as mídias ---
export async function GET() {
    try {
        const sql = `
            SELECT * FROM midia 
            WHERE id_usuario = $1
            ORDER BY id_midia DESC;
        `;
        const result = await database.query(sql, [MOCK_USER_ID]);

        return NextResponse.json({ list: result.rows });

    } catch (error) {
        console.error('GET Error - Falha ao buscar mídias:', error.message);
        return NextResponse.json({ 
            error: 'Falha ao buscar mídias. Verifique a conexão com o DB.' 
        }, { status: 500 });
    }
}

// --- POST: Criar nova mídia ---
export async function POST(request) {
    try {
        const data = await request.json();
        
        const { titulo, tipo, status, avaliacao, data_conclusao, foto_url } = data;

        if (!titulo || !tipo || !status) {
            return NextResponse.json({ error: 'Título, Tipo e Status são obrigatórios.' }, { status: 400 });
        }

        const sql = `
            INSERT INTO midia 
            (id_usuario, titulo, tipo, status, avaliacao, data_conclusao, foto_url)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `;

        const params = [
            MOCK_USER_ID, 
            titulo, 
            tipo, 
            status, 
            avaliacao || null, 
            data_conclusao || null, 
            foto_url || null 
        ];

        const result = await database.query(sql, params);

        if (result.rows && result.rows.length > 0) {
            return NextResponse.json({ 
                message: "Mídia adicionada com sucesso!", 
                item: result.rows[0] 
            }, { status: 201 });
        } else {
             throw new Error("A inserção foi realizada, mas não retornou o registro.");
        }

    } catch (error) {
        console.error('POST Error - Falha ao inserir mídia:', error.message);
        return NextResponse.json({ 
            error: error.message || "Erro interno ao adicionar mídia." 
        }, { status: 500 });
    }
}

// --- PUT: Atualizar mídia existente ---
export async function PUT(request) {
    let id_midia = null;
    try {
        const url = new URL(request.url);
        id_midia = url.searchParams.get('id'); // ID via query parameter
        const data = await request.json();
        
        // 🛑 Importante: todos os campos enviados pelo formulário
        const { titulo, tipo, status, avaliacao, data_conclusao, foto_url } = data; 
        
        if (!id_midia) {
            return NextResponse.json({ error: 'ID da mídia é obrigatório para atualização.' }, { status: 400 });
        }

        const sql = `
            UPDATE midia
            SET 
                titulo = $1, 
                tipo = $2, 
                status = $3, 
                avaliacao = $4, 
                data_conclusao = $5,
                foto_url = $6 /* 🛑 Adicionando foto_url para edição */
            WHERE id_midia = $7 AND id_usuario = $8
            RETURNING *;
        `;

        const params = [
            titulo,
            tipo,
            status,
            avaliacao || null, 
            data_conclusao || null,
            foto_url || null, // $6
            id_midia, // $7
            MOCK_USER_ID // $8
        ];

        const result = await database.query(sql, params);

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Mídia não encontrada ou pertence a outro usuário.' }, { status: 404 });
        }

        return NextResponse.json({ 
            message: 'Mídia atualizada com sucesso!', 
            item: result.rows[0] 
        }, { status: 200 });

    } catch (error) {
        console.error(`PUT Error - Falha ao atualizar mídia (ID: ${id_midia}):`, error.message);
        return NextResponse.json({ 
            error: error.message || "Erro interno ao atualizar mídia. Verifique a query SQL." 
        }, { status: 500 });
    }
}

// --- DELETE: Deletar mídia ---
export async function DELETE(request) {
    let id_midia = null;
    try {
        const url = new URL(request.url);
        id_midia = url.searchParams.get('id'); 

        if (!id_midia) {
            return NextResponse.json({ error: 'ID da mídia é obrigatório para deleção.' }, { status: 400 });
        }

        const sql = `
            DELETE FROM midia 
            WHERE id_midia = $1 AND id_usuario = $2 
            RETURNING id_midia;
        `;
        
        const result = await database.query(sql, [id_midia, MOCK_USER_ID]);

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Mídia não encontrada ou você não tem permissão para deletar.' }, { status: 404 });
        }

        return NextResponse.json({ 
            message: 'Mídia deletada com sucesso!',
            deletedId: parseInt(id_midia)
        }, { status: 200 });

    } catch (error) {
        console.error(`DELETE Error - Falha ao deletar mídia (ID: ${id_midia}):`, error.message);
        return NextResponse.json({ 
            error: error.message || 'Erro interno ao deletar mídia. Verifique a query SQL.' 
        }, { status: 500 });
    }
}