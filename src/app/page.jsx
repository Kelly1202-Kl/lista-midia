// app/page.jsx

'use client'; 

import { useState, useEffect } from 'react';
import MediaForm from '../components/MediaForm';
import MediaTable from '../components/MediaTable'; // Importa o componente Tabela
import styles from './page.module.css';


export default function HomePage() {
    const [mediaList, setMediaList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingMedia, setEditingMedia] = useState(null); // Estado para o item sendo editado


    // 1. Função para buscar os dados do banco (GET)
    const fetchMedia = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/midia', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Falha ao buscar a lista de mídias.');
            }

            const data = await response.json();
            // Ordena pelo ID para mostrar os itens mais recentes primeiro
            const sortedList = data.list.sort((a, b) => b.id_midia - a.id_midia);
            setMediaList(sortedList || []); 
            
        } catch (err) {
            console.error('Erro ao carregar mídias:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Executa a busca inicial ao montar o componente
    useEffect(() => {
        fetchMedia();
    }, []); 


    // 2. CRUD: Adicionar (Pós-POST)
    const handleMediaAdded = (newItem) => {
        // Adiciona o novo item no início da lista (o mais recente)
        setMediaList(prevList => [newItem, ...prevList]);
    };
    
    // 3. CRUD: Deletar (Pós-DELETE)
    const handleMediaDeleted = (deletedId) => {
        // Filtra a lista, removendo o item com o ID deletado
        setMediaList(prevList => prevList.filter(media => media.id_midia !== deletedId));
        
        // Se o item deletado for o que estava sendo editado, limpa o formulário de edição
        if (editingMedia && editingMedia.id_midia === deletedId) {
            setEditingMedia(null);
        }
    };
    
    // 4. CRUD: Iniciar Edição (Passa os dados para o MediaForm)
    const handleMediaEdit = (media) => {
        setEditingMedia(media); // Preenche o formulário com os dados do item
        // Opcional: Rolar para o formulário
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    // 5. CRUD: Finalizar Edição (Pós-PUT e Limpeza)
    const handleEditComplete = (updatedItem) => {
        setEditingMedia(null); // Limpa o estado de edição

        // Atualiza a lista localmente sem recarregar tudo
        setMediaList(prevList => prevList.map(item => 
            item.id_midia === updatedItem.id_midia ? updatedItem : item
        ));
    };


    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Minha Lista de Mídias</h1>
            </header>

            {/* Formulário de Adição/Edição */}
            <div className={styles.formSection}>
                <MediaForm 
                    onMediaAdded={handleMediaAdded} 
                    initialData={editingMedia} 
                    onEditComplete={handleEditComplete}
                    // Adicione uma prop para indicar o modo (ex: 'Adicionar' ou 'Editar')
                    isEditing={!!editingMedia} 
                    // Se estiver em modo edição, o formulário deve limpar o modo ao cancelar
                    onCancelEdit={() => setEditingMedia(null)}
                />
            </div>

            <h2 className={styles.sectionTitle}>Mídias Cadastradas</h2>
            
            {/* Exibição da Lista em Tabela */}
            <div className={styles.listSection}>
                {loading && <p>Carregando mídias...</p>}
                {error && <p className={styles.errorMessage}>Erro ao carregar mídias: {error}</p>}

                {/* Renderiza a Tabela */}
                {!loading && mediaList.length > 0 && (
                    <MediaTable
                        mediaList={mediaList}
                        onDelete={handleMediaDeleted} 
                        onEdit={handleMediaEdit}
                    />
                )}
                
                {/* Mensagem de Lista Vazia */}
                {!loading && mediaList.length === 0 && (
                    <p style={{textAlign: 'center', color: '#000000ff'}}>Nenhuma mídia cadastrada ainda. Adicione uma acima!</p>
                )}
            </div>
        </div>
    );
}