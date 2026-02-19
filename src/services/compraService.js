export const guardarCompra = async (data) => {
  const response = await fetch("/api/comprar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return response.json();
};
