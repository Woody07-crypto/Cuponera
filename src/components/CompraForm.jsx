function CompraForm({ cantidad, setCantidad, onComprar }) {
  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Comprar Cupón</h2>

      <input
        type="number"
        min="1"
        value={cantidad}
        onChange={(e) => setCantidad(e.target.value)}
        style={styles.input}
      />

      <button onClick={onComprar} style={styles.button}>
        Proceder al pago
      </button>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: "var(--color-surface)",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 4px 10px var(--color-shadow)",
    width: "400px",
    textAlign: "center"
  },
  title: {
    color: "var(--color-primary)",
    marginBottom: "1rem"
  },
  input: {
    width: "100%",
    padding: "0.7rem",
    marginBottom: "1rem",
    borderRadius: "8px",
    border: "1px solid var(--color-border)"
  },
  button: {
    width: "100%",
    backgroundColor: "var(--color-accent)",
    color: "var(--color-text-invert)",
    border: "none"
  }
};

export default CompraForm;
