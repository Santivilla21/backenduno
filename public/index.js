const socket = io();

// Formulario
const title = document.getElementById("title");
const description = document.getElementById("description");
const price = document.getElementById("price");
const img = document.getElementById("img");
const code = document.getElementById("code");
const stock = document.getElementById("stock");
const category = document.getElementById("category");
const status = document.getElementById("status");
const btnEnviar = document.getElementById("btnEnviar");


const listaProductos = document.getElementById("listaProductos");

btnEnviar.addEventListener("click", () => {
  const producto = {
    title: title.value,
    description: description.value,
    price: parseFloat(price.value),
    img: img.value,
    code: code.value,
    stock: parseInt(stock.value),
    category: category.value,
    status: status.value === "true",
    thumbnails: []
  };

  socket.emit("nuevoProducto", producto);

  //borrar
  title.value = "";
  description.value = "";
  price.value = "";
  img.value = "Sin imagen";
  code.value = "";
  stock.value = "";
  category.value = "";
  status.value = "true";
});

// escuchar productos actualizados
socket.on("actualizarProductos", (productos) => {
  listaProductos.innerHTML = "";

  productos.forEach((prod) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
      <p><strong>${prod.title}</strong></p>
      <p>${prod.description}</p>
      <p>$${prod.price}</p>
    `;
    listaProductos.appendChild(div);
  });
});
