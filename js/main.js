document.addEventListener("DOMContentLoaded",()=>{
const form=document.getElementById("addClientForm");
if(form){
 form.addEventListener("submit",e=>{
  e.preventDefault();
  const name=document.getElementById("name").value.trim();
  const email=document.getElementById("email").value.trim();
  const age=+document.getElementById("age").value;
  const phone=document.getElementById("phone").value.trim();
  const msg=document.getElementById("formMsg");
  const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(age<=0){msg.textContent="Age must be > 0";msg.style.color="red";return;}
  if(!emailRegex.test(email)){msg.textContent="Invalid email";msg.style.color="red";return;}
  if(phone.length<8){msg.textContent="Phone too short";msg.style.color="red";return;}
  msg.textContent="Client added (simulation)";msg.style.color="green";
 });
}

const table=document.querySelector("#clientsTable tbody");
const search=document.getElementById("searchBox");
if(table){
 fetch("data/clients.json").then(r=>r.json()).then(data=>{
  let clients=data;
  function render(list){
   table.innerHTML="";
   list.forEach(c=>{
    table.innerHTML+=`<tr>
     <td>${c.name}</td><td>${c.phone}</td>
     <td><a class='action edit' href='client.html?id=${c.id}'>Open</a>
     <button class='action delete'>Delete</button></td></tr>`;
   });
  }
  render(clients);
  search.addEventListener("input",()=>render(clients.filter(c=>c.name.toLowerCase().includes(search.value.toLowerCase()))));
 });
}

const params=new URLSearchParams(window.location.search);
const id=params.get("id");
if(id){
 fetch("data/clients.json").then(r=>r.json()).then(d=>{
  const c=d.find(x=>x.id==id);
  if(c){document.getElementById("clientDetails").innerHTML=`<h2>${c.name}</h2><p>Phone: ${c.phone}</p>`;}
 });
}
});