const cart = [];
const cartBtn = document.getElementById("cartBtn");
const cartPanel = document.getElementById("cartPanel");
const closeCart = document.getElementById("closeCart");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");
const toast = document.getElementById("toast");

function money(n){ return "$" + n.toFixed(2); }
function showToast(message){
  toast.textContent = message; toast.classList.add("show");
  setTimeout(()=>toast.classList.remove("show"), 2200);
}
function openCart(){ cartPanel.classList.add("open"); overlay.classList.add("show"); }
function hideCart(){ cartPanel.classList.remove("open"); overlay.classList.remove("show"); }
cartBtn.addEventListener("click", openCart);
closeCart.addEventListener("click", hideCart);
overlay.addEventListener("click", hideCart);

function renderCart(){
  cartCount.textContent = cart.reduce((sum,i)=>sum+i.qty,0);
  if(!cart.length){
    cartItems.innerHTML = '<p class="empty">Your basket is empty.<br>Add something delicious!</p>';
    cartTotal.textContent = "$0.00"; return;
  }
  cartItems.innerHTML = cart.map((item,index)=>`
    <div class="cart-row">
      <div><strong>${item.name}</strong><small>${money(item.price)} each</small></div>
      <div class="qty">
        <button onclick="changeQty(${index},-1)">−</button><span>${item.qty}</span><button onclick="changeQty(${index},1)">+</button>
      </div>
      <strong>${money(item.price*item.qty)}</strong>
    </div>`).join("");
  cartTotal.textContent = money(cart.reduce((sum,i)=>sum+i.price*i.qty,0));
}
function addItem(name,price){
  const found=cart.find(i=>i.name===name);
  if(found) found.qty++; else cart.push({name,price:Number(price),qty:1});
  renderCart(); showToast(`${name} added to basket`);
}
function changeQty(index,delta){
  cart[index].qty += delta;
  if(cart[index].qty<=0) cart.splice(index,1);
  renderCart();
}
document.querySelectorAll(".add-btn").forEach(btn=>{
  btn.addEventListener("click",()=>addItem(btn.dataset.name,btn.dataset.price));
});
document.querySelectorAll(".filter-tabs button").forEach(btn=>{
  btn.addEventListener("click",()=>{
    document.querySelectorAll(".filter-tabs button").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    const category=btn.dataset.category;
    document.querySelectorAll(".menu-item").forEach(item=>{
      item.style.display=(category==="all"||item.dataset.category===category)?"grid":"none";
    });
  });
});
document.getElementById("checkoutBtn").addEventListener("click",()=>{
  if(!cart.length){showToast("Your basket is empty.");return;}
  showToast("Demo order received! Connect a payment/order service for real orders.");
});
document.getElementById("bookingForm").addEventListener("submit",(e)=>{
  e.preventDefault();
  const form=e.currentTarget, data=new FormData(form);
  showToast(`Thanks ${data.get("name")}! Your booking request has been received.`);
  form.reset();
});
document.getElementById("menuToggle").addEventListener("click",()=>{
  document.getElementById("nav").classList.toggle("open");
});
document.querySelectorAll(".nav a").forEach(a=>a.addEventListener("click",()=>document.getElementById("nav").classList.remove("open")));
document.getElementById("year").textContent=new Date().getFullYear();
