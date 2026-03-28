async function registrar(event) {
  event.preventDefault();
}

const username = document.querySelector("#username").value;
const email = document.querySelector("#email").value
const senha = document.querySelector("#password").value

if (!username || !email || !senha){
    alert("Prencha todos os campos para registrar!")
    return;
}

const {data} = await supabaseClient 
.from('profiles')
.select('*')
.eq('username', username);

if (data.lenght > 0 ){
    alert('Usuario ja existe!')
    return;
}

const {data: authData, error} = await supabaseClient.auth.signUp({
    email,
    password: senha
})