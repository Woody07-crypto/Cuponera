function ConfirmacionCompra({ codigo }) {
  return (
    <div style={{ marginTop: "1rem", color: "var(--color-primary)" }}>
      <h3>¡Compra exitosa! </h3>
      <p>Tu código de cupón es:</p>
      <strong>{codigo}</strong>
    </div>
  );
}

export default ConfirmacionCompra;
