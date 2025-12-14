// components/MediaTable.jsx
'use client';

import styles from '../app/page.module.css';
// Mapeamentos (usando os mesmos do MediaCard/MediaForm)
const STATUS_DISPLAY_MAP = {
    'want_to_watch': 'Quero Assistir', 
    'watching': 'A Assistir',
    'watched': 'Assistido',
};

export default function MediaTable({ mediaList, onDelete, onEdit }) {
    
    // Lógica de Deleção (Replicada do MediaCard)
    const handleDeleteClick = async (id_midia, titulo) => {
        if (!confirm(`Tem certeza que deseja deletar "${titulo}"?`)) {
            return;
        }

        try {
            const response = await fetch(`/api/midia?id=${id_midia}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Falha ao deletar mídia.');
            }
            
            const result = await response.json();
            
            if (onDelete) {
                onDelete(result.deletedId);
            }

        } catch (error) {
            console.error('Erro ao deletar:', error);
            alert(`Erro ao deletar: ${error.message}`);
        }
    };
    
    // Lógica de Edição (Replicada do MediaCard)
    const handleEditClick = (media) => {
        if (onEdit) {
            onEdit(media); 
        }
    };

    return (
        <div className={styles.tableContainer}>
            <table className={styles.mediaTable}>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Capa</th>
                        <th>Título</th>
                        <th>Tipo</th>
                        <th>Status</th>
                        <th>Avaliação</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {mediaList.map((media, index) => {
                        // O mapeamento acima garante que o statusDisplay será 'Quero Assistir', 'A Assistir' ou 'Assistido'
                        const statusDisplay = STATUS_DISPLAY_MAP[media.status] || media.status;      
                        // Mapeamento de classes de estilo para o Status
                        const statusClass = {
                           'Assistido': styles.statusGreen,
                           'A Assistir': styles.statusYellow,
                           'Quero Assistir': styles.statusBlue, // Corrigido para 'Quero Assistir'
                        }[statusDisplay] || styles.statusDefault;

                        return (
                            <tr key={media.id_midia}>
                                <td>{index + 1}</td>
                                <td className={styles.tableImageCell}>
                                    {media.foto_url ? (
                                        <img 
                                            src={media.foto_url} 
                                            alt={`Capa de ${media.titulo}`} 
                                            className={styles.tableImage}
                                            onError={(e) => { e.target.style.display='none'; e.target.closest('td').classList.add(styles.placeholderCell) }}
                                        />
                                    ) : (
                                        <div className={styles.placeholderCell}>
                                            {media.titulo.substring(0, 1)}
                                        </div>
                                    )}
                                </td>
                                <td className={styles.tableTitle}>{media.titulo}</td>
                                <td>{media.tipo}</td>
                                <td>
                                    <span className={`${styles.mediaStatus} ${statusClass}`}>
                                        {statusDisplay}
                                    </span>
                                </td>
                                
                                {/* ***** LINHA CORRIGIDA ***** */}
                                <td>{media.avaliacao ? `${media.avaliacao}/10` : 'N/A'}</td>
                                {/* ************************** */}
                                
                                <td className={styles.actionCell}>
                                    <button 
                                        // Usando a nova classe para botão de Editar (Verde)
                                        className={styles.editButtonGreen} 
                                        // SOLUÇÃO: Passar o objeto 'media' completo para a função
                                        onClick={() => handleEditClick(media)}
                                    >
                                        Editar
                                    </button>
                                    <button 
                                        // Usando a nova classe para botão de Deletar (Vermelho)
                                        className={styles.deleteButtonRed} 
                                        onClick={() => handleDeleteClick(media.id_midia, media.titulo)}
                                    >
                                        Deletar
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}