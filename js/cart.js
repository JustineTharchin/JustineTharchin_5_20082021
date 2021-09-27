const url = `http://localhost:3000/api/cameras/`;
const cart = JSON.parse(localStorage.getItem("cameras")) || [];

function displayProductListTable(product) {
    const indexProduct = cart.indexOf(product);
    const productList = document.getElementById("productsInCart");
    productList.innerHTML += `
    <tr class="text-center">
        <td class="w-25">
            <img src="${product.imageUrl}" class="img-fluid img-thumbnail" alt="${product.name}">
        </td>
        <td class="align-middle">
            <span>${product.name}</span>
        </td>
        <td class="align-middle">
            <span>${product.option}</span>
        </td>
        <td class="align-middle productQuantity">
            <button type="button" class="rounded minus data-toggle="modal" data-target="#exampleModal"><span class="fas fa-minus-square text-dark" data-index="${indexProduct}"></span></button>
            <span class="mx-0 mx-lg-3"> ${product.quantity}</span>
            <button type="button" class="rounded plus" data-toggle="modal" data-target="#exampleModal"><span class="fas fa-plus-square" data-index="${indexProduct}"></span></button>
        </td>
        <td class="align-middle">
            <span>${convertPrice(product.price)}</span>
        </td>
        <td class="align-middle">
            <span>${convertPrice(product.quantity * product.price)}</span>
        </td>
    </tr>`;
}

function convertPrice(productPrice) {
    let price = `${productPrice}`;
    price = Intl.NumberFormat("fr-FR", {style: "currency",currency: "EUR",}).format(price / 100);
    return price;
}

function totalCart() {
    let totalCart = 0;
    cart.forEach((camera) => {
        totalCart = totalCart + camera.price * camera.quantity;
        
    });
    return totalCart;
}

function totalPrice() {
    const totalPrice = document.getElementById("totalPrice");
    totalPrice.innerHTML += `${convertPrice(totalCart())}`;
}

const orderForm = document.getElementById("orderForm");
const emptyCart = document.getElementById("emptyCart");

if (cart.length < 1) {
    orderForm.classList.add("d-none");
    // sinon affiche le tableau avec les produits
} else {
    orderForm.classList.add("d-none");
    emptyCart.classList.add("d-none");
    const fullCart = document.getElementById("cart");
    fullCart.classList.toggle("d-none");
    for (product of cart) {
        displayProductListTable(product);
    }

    function addProduct(event) {
        const index = event.target.getAttribute("data-index");
        cart[index].quantity++;
        localStorage.setItem("cameras", JSON.stringify(cart));
        location.reload();
    }

    const buttonAdd = document.getElementsByClassName("plus");
    for (add of buttonAdd) {
        add.addEventListener("click", addProduct);
    }

    function minusProduct(event) {
        const index = event.target.getAttribute("data-index");
        if(cart[index].quantity > 0){
            cart[index].quantity--;
        }else {
            cart[index].clear(); 
        }
        localStorage.setItem("cameras", JSON.stringify(cart));
        location.reload();
    }

    const buttonMinus = document.getElementsByClassName("minus");
    for (minus of buttonMinus) {
        minus.addEventListener("click", minusProduct);
    }

    totalPrice();

    const validationCart = document.getElementById("validationCart");
    validationCart.addEventListener("click", () => {
        orderForm.classList.toggle("d-none");
    });

    const buttonClearCart = document.getElementById("clearCart");
    buttonClearCart.addEventListener("click", () => {
        localStorage.clear();
        location.reload();
    });


//CONTACT FORMULAIRE

    //validation du formulaire et envoie en POST
    const order = document.getElementById("order");
    const firstName = document.getElementById("firstName");
    const lastName = document.getElementById("lastName");
    const city = document.getElementById("city");
    const mail = document.getElementById("email");
    const address = document.getElementById("adress");
    const checkBox = document.getElementById("invalidCheck2");

    order.addEventListener("click", (event) => {
        // on prépare les infos pour l'envoie en POST
        let contact = {
            firstName: document.getElementById("firstName").value,
            lastName: document.getElementById("lastName").value,
            address: document.getElementById("address").value,
            city: document.getElementById("city").value,
            email: document.getElementById("email").value,
        };
    
            event.preventDefault();

            let products = [];
            for (selectedCameras of cart) {
                products.push(selectedCameras.id);
            }

            fetch("http://localhost:3000/api/cameras/order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ contact, products }),
            })
                .then((response) => response.json())
                .then((data) => {
                    localStorage.setItem("order", JSON.stringify(data));
                    document.location.href = "order.html";
                })
                .catch((erreur) => console.log("erreur : " + erreur));
      
    });
}