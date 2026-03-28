// LOGIN COM USERNAME
async function login(event) {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const senha = document.getElementById('senha').value;

  if (!username || !senha) {
    alert("Preencha tudo");
    return;
  }

  // busca usuário pelo username
  const { data, error } = await supabaseClient
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single();

  if (error || !data) {
    alert("Usuário não encontrado");
    return;
  }

  const email = data.email;

  // login com email
  const { error: loginError } = await supabaseClient.auth.signInWithPassword({
    email,
    password: senha
  });

  if (loginError) {
    alert("Senha incorreta");
  } else {
    window.location.href = "index.html"; // ou dashboard
  }
}

// REGISTRO
async function registrar(event) {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  if (!username || !email || !senha) {
    alert("Preencha todos os campos");
    return;
  }

  // verifica username
  const { data: existing } = await supabaseClient
    .from('profiles')
    .select('*')
    .eq('username', username);

  if (existing.length > 0) {
    alert("Usuário já existe");
    return;
  }

  // cria auth
  const { data: authData, error } = await supabaseClient.auth.signUp({
    email,
    password: senha
  });

  if (error) {
    alert(error.message);
    return;
  }

  const user = authData.user;

  // salva profile
  const { error: profileError } = await supabaseClient
    .from('profiles')
    .insert([
      {
        id: user.id,
        username,
        email
      }
    ]);

  if (profileError) {
    alert("Erro ao salvar perfil");
    return;
  }

  alert("Conta criada!");
  window.location.href = "login.html";
}

// RECUPERAR SENHA
async function recuperarSenha(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;

  if (!email) {
    alert("Digite o email");
    return;
  }

  const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
    redirectTo: "https://wintu006.github.io/Dashboard/"
  });

  if (error) {
    alert("Erro ao enviar email");
  } else {
    alert("Email de recuperação enviado!");
  }
}

// expor funções
window.login = login;
window.registrar = registrar;
window.recuperarSenha = recuperarSenha;