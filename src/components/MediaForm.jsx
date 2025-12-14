'use client'; 

import { useState, useEffect } from 'react'; // *** IMPORTAR useEffect ***
import styles from '../app/page.module.css';

// O componente agora recebe as props de edição
export default function MediaForm({ onMediaAdded, initialData, onEditComplete, onCancelEdit, isEditing }) {

    const [formData, setFormData] = useState({
        // Adiciona id_midia para edição
        id_midia: null, 
        titulo: '',
        tipo: 'Filme',
        // ATENÇÃO: Corrigi o status para usar valores do BD, não display
        // Você deve usar 'want_to_watch', 'watching', 'watched' no backend
        status: 'want_to_watch', 
        avaliacao: '',
        data_conclusao: '',
        // Corrigi o nome da prop para 'foto_url', que é o que você usou na tabela
        foto_url: '',
    });

    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);


    // --------------------------------------------------------
    // *** CORREÇÃO CHAVE 1: SINCRONIZAR ESTADO COM DADOS DE EDIÇÃO ***
    // Usa initialData (passado pelo componente pai) para preencher o formulário
    useEffect(() => {
        if (initialData) {
            // Modo Edição: Preenche o estado com os dados recebidos
            setFormData({
                id_midia: initialData.id_midia,
                titulo: initialData.titulo || '',
                tipo: initialData.tipo || 'Filme',
                status: initialData.status || 'want_to_watch',
                // Garante que a avaliação é um número ou string vazia
                avaliacao: initialData.avaliacao ? String(initialData.avaliacao) : '',
                data_conclusao: initialData.data_conclusao || '',
                foto_url: initialData.foto_url || '',
            });
            setMessage(`Editando: ${initialData.titulo}`);
        } else {
            // Modo Adição: Limpa o formulário
            setFormData({
                id_midia: null,
                titulo: '',
                tipo: 'Filme',
                status: 'want_to_watch',
                avaliacao: '',
                data_conclusao: '',
                foto_url: '',
            });
            setMessage('');
        }
        setIsError(false);
    }, [initialData]); // Roda sempre que o item a ser editado muda
    // --------------------------------------------------------


    // Manipula mudanças nos campos do formulário
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    // --------------------------------------------------------
    // *** CORREÇÃO CHAVE 2: LÓGICA DE ENVIO (POST vs PUT) ***
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const method = formData.id_midia ? 'PUT' : 'POST';
        const url = formData.id_midia ? `/api/midia?id=${formData.id_midia}` : '/api/midia';
        const actionText = formData.id_midia ? 'atualizando' : 'adicionando';
        
        setMessage(`A ${actionText} mídia...`);
        setIsError(false);

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.error || `Falha ao ${actionText} mídia.`);
            }

            // Sucesso
            setMessage(`Mídia ${formData.id_midia ? 'atualizada' : 'adicionada'} com sucesso!`);
            setIsError(false);
            
            // Limpa e notifica o componente pai
            if (method === 'POST' && onMediaAdded) {
                onMediaAdded(result.item);
            } else if (method === 'PUT' && onEditComplete) {
                onEditComplete(result.item); // Passa o item atualizado para o pai
            }

        } catch (error) {
            setMessage(`Erro: ${error.message}`);
            setIsError(true);
            console.error('Erro ao enviar formulário:', error);
        }
    };
    // --------------------------------------------------------


    return (
        <form onSubmit={handleSubmit} className={styles.formContainer}>

            <h2>{isEditing ? 'Editar Mídia' : 'Adicionar Nova Mídia'}</h2>
            
            {message && (
                <p className={isError ? styles.errorMessage : styles.successMessage}>
                    {message}
                </p>
            )}
            
            {/* Título */}
            <div className={styles.formGroup}>
                <label htmlFor="titulo">Título *</label>
                <input
                    type="text"
                    id="titulo"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleChange}
                    required
                />
            </div>
            
            {/* Tipo (Filme/Série) */}
            <div className={styles.formGroup}>
                <label htmlFor="tipo">Tipo *</label>
                <select
                    id="tipo"
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleChange}
                    required
                >
                    <option value="Filme">Filme</option>
                    <option value="Serie">Série</option>
                    <option value="Anime">Anime</option>
                </select>
            </div>
            
            {/* Status (ATENÇÃO: Use os valores do Backend/Tabela) */}
            <div className={styles.formGroup}>
                <label htmlFor="status">Status *</label>
                <select
                    id="status"
                    name="status"
                    // Os valores do select devem ser os mesmos usados no BD/Tabela (want_to_watch, etc.)
                    value={formData.status} 
                    onChange={handleChange}
                    required
                >
                    {/* Alterei os valores para serem consistentes com a Tabela/BD */}
                    <option value="watching">A Assistir</option> 
                    <option value="watched">Assistido</option>
                    <option value="want_to_watch">Quero Assistir</option>
                </select>
            </div>


            {/* Avaliação (Opcional) */}
            <div className={styles.formGroup}>
                <label htmlFor="avaliacao">Avaliação (1-10)</label>
                <input
                    type="number"
                    id="avaliacao"
                    name="avaliacao"
                    value={formData.avaliacao}
                    onChange={handleChange}
                    min="1"
                    max="10"
                    placeholder="Opcional" 
                />
            </div>

            {/* Data (Corrigi o name para data_conclusao, se for essa a intenção)
            <div className={styles.formGroup}>
                <label htmlFor="data_conclusao">Data de Conclusão</label>
                <input
                    type="date"
                    id="data_conclusao"
                    name="data_conclusao" // Nome correto do campo no estado
                    value={formData.data_conclusao}
                    onChange={handleChange}
                />
            </div> */}
            
            {/* Novo campo para URL da Foto (Recomendado para a Capa)
            <div className={styles.formGroup}>
                <label htmlFor="foto_url">URL da Capa (Opcional)</label>
                <input
                    type="text"
                    id="foto_url"
                    name="foto_url"
                    value={formData.foto_url}
                    onChange={handleChange}
                    placeholder="Link da imagem da capa"
                />
            </div> */}

            <button type="submit" className={styles.submitButton}>
                {isEditing ? 'Salvar Edição' : 'Adicionar à Lista'}
            </button>
            
            {/* Botão de Cancelar Edição */}
            {isEditing && (
                <button 
                    type="button" 
                    onClick={onCancelEdit} 
                    className={styles.cancelButton}
                >
                    Cancelar Edição
                </button>
            )}
        </form>
    );
}