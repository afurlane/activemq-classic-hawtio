export const useScrollStyles = () => {
  const scroll = (maxHeight: string): React.CSSProperties => ({
    maxHeight,
    overflowY: 'auto',
    scrollbarGutter: 'stable',
    marginTop: '0.5rem'
  });

  return {
    modalScroll: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      maxHeight: '80vh',
      overflowY: 'auto',
      scrollbarGutter: 'stable'
    } as React.CSSProperties,

    bodyScroll: scroll('min(50vh, 400px)'),
    sectionScroll: scroll('min(30vh, 250px)')
  };
};
