// components/MediaListAndForm.jsx
'use client';

import { useState } from 'react';
import styles from '../app/page.module.css'; 
import MediaForm from './MediaForm';
import MediaCard from './MediaCard'; // Importa o novo componente

// Componente principal que gerencia o estado da lista e exibe o formulário
export default function MediaListAndForm({ initialMediaList, initialError }) {
    const [mediaList, setMediaList] = useState(initialMediaList || []);
    const [error, setError] = useState(initialError);

 // Função passada para o formulário para atualizar a lista instantaneamente
 const handleMediaAdded = (newItem) => {
 // Adiciona o novo item no início da lista para visualização imediata
 setMediaList(prevList => [newItem, ...prevList]);
 setError(null); // Limpa o erro se a adição for bem-sucedida
 };
 
 return (
 <div className={styles.page}>
 {/* HEADER (Estilo definido no CSS) */}
 <header className={styles.header}>
 <h1> Minha Lista de Mídias </h1>
 </header>
 
 {/* FORMULÁRIO */}
 <div className={styles.formSection}>
 <MediaForm onMediaAdded={handleMediaAdded} />
 </div>

 <h2 className={styles.listTitle}>Mídias Cadastradas</h2>
 
 {/* Exibição do Erro */}
 {error && <p className={styles.error}>{error}</p>}

 {/* LISTA DE MÍDIAS (Cards) */}
 <div className={styles.mediaContainer}> 
    { mediaList.length > 0 ? (
    mediaList.map((item) => (
   <MediaCard 
key={item.id_midia} 
 item={item} 
 />
 ))
) : (
!error && <p className={styles.noData}>Nenhuma mídia encontrada. Use o formulário acima para adicionar!</p>
 )}
 </div>
</div> );
}
