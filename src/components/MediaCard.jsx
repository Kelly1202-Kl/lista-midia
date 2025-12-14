// components/MediaCard.jsx
import styles from '../app/page.module.css'; // Ajuste o caminho do CSS

// Mapeamento Inverso (DB para Exibição)
const STATUS_DISPLAY_MAP = {
  'watched': 'Assistido',
  'watching': 'A Assistir',
 'want_to_watch': 'Quero Ver',
};

const TYPE_DISPLAY_MAP = {
  'movie': 'Filme',
  'series': 'Série', // Pode ser 'Série' ou 'Anime', dependendo de como você quer exibir
  'other': 'Outro',
};
export default function MediaCard({ media, index }) {
  
  // Tradução dos valores do DB (Inglês) para a interface (Português)
  const statusDisplay = STATUS_DISPLAY_MAP[media.status] || media.status;
  const typeDisplay = TYPE_DISPLAY_MAP[media.tipo] || media.tipo; 
  const isWatched = media.status === 'watched';
  const avaliacao = media.avaliacao ? `${media.avaliacao}/10` : media.avaliacao;

 // Classes de estilo dinâmicas para o status (verde, amarelo, etc.)
 const statusClass = {
    'Assistido': styles.statusGreen,
    'A Assistir': styles.statusYellow,
    'Quero Ver': styles.statusBlue,
   }[statusDisplay] || styles.statusDefault;


  return (
     <div className={styles.mediaCard}>
       <div className={styles.mediaHeader}>
                 {/* Pra aparecer imagem*/}
     {/* ⚠️ Se você tivesse foto_url: 
 {media.foto_url && <img src={media.foto_url} alt={media.titulo} className={styles.mediaImage} />}
*/}

 <span className={styles.mediaIndex}>#{index}</span>
     <h3 className={styles.mediaTitle}>{media.titulo}</h3>
         <span className={`${styles.mediaStatus} ${statusClass}`}>
             {statusDisplay}
     </span>
 </div>

<div className={styles.mediaDetails}>
        <p><strong>Tipo:</strong> {typeDisplay}</p>
        {isWatched && (
        <>
            <p><strong>Avaliação:</strong> {avaliacao}</p>
        </>
        )}
</div>
</div>
        );
        }