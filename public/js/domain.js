let data = [];

// Fetch para buscar os dados no arquivo json
async function fetchData() {
  try {
    const res = await fetch("/api/domains");
    data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    data = [];
    return [];
  }
}

// Função para popular a tabela
async function populateTable() {
  if (!data.length) {
    await fetchData();
  }
  const tableBody = document.querySelector("tbody");
  tableBody.innerHTML = "";

  data.forEach((item, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <th scope="row" class="text-center">${index + 1}</th>
      <td class="text-center">${item.address}</td>
      <td class="text-center">${item.tag}</td>
      <td class="text-center">${item.sipServer}</td>
      <td class="text-center">${item.status}</td>
      <td class="text-center">
        <i class="rounded-1 bi bi-pencil-square mx-3 bg-primary text-light p-1" onclick="openEditModal(${index})"></i>
        <i class="rounded-1 bi bi-trash3-fill bg-danger text-light p-1" onclick="openDelModal(${index})"></i>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Função para adicionar novo elemento na tabela

function insertNew() {
  const addButton = document.getElementById("addButton");

  addButton.addEventListener("click", () => {
    const addr = document.getElementById("address").value;
    const tag = document.getElementById("tag").value;
    const regStats = document.getElementById("status").value;
    const proxySIP = document.getElementById("sipServer").value;

    if (addr && tag && proxySIP) {
      data.push({
        address: addr,
        tag: tag,
        status: regStats,
        sipServer: proxySIP,
      });

      // Atualizar tabela
      populateTable();

      document.getElementById("address").value = "";
      document.getElementById("tag").value = "";
      document.getElementById("status").value = "";
      document.getElementById("sipServer").value = "";
    }
    else alert("Por favor, preencha todos os campos antes de adicionar.");
  });
}

// Pedir confirmação antes do elemento ser excluído

function openDelModal(index) {
  const delModal = new bootstrap.Modal(document.getElementById("deleteModal"));
  delModal.show();

  const confirmDeleteButton = document.getElementById("confirmDelete");
  confirmDeleteButton.onclick = () => {
    deleteRow(index);
    delModal.hide();
  };
}

// Remove uma linha da tabela com base no ID do elemento
function deleteRow(index) {
  data.splice(index, 1);
  populateTable();
}

// Função para abrir o modal de edição de um item, pelo índice
function openEditModal(index) {
  const entry = data[index];
  document.getElementById("editTag").value = entry.tag;
  document.getElementById("editDomain").value = entry.address;
  document.getElementById("editStatus").value = entry.status;
  document.getElementById("editProxy").value = entry.sipServer;

  document.getElementById("saveEdit").onclick = () => saveEdit(index);
  const editModal = new bootstrap.Modal(document.getElementById("editModal"));
  editModal.show();
}

// Função para salvar as alterações feitas no modal de edição
function saveEdit(index) {
  const updatedDomain = document.getElementById("editDomain").value;
  const updatedTag = document.getElementById("editTag").value;
  const updatedProxy = document.getElementById("editProxy").value;
  const updatedRegister = document.getElementById("editStatus").value;

  if (updatedDomain&& updatedTag && updatedDomain && updatedProxy) {
    data[index] = {
      address: updatedDomain,
      tag: updatedTag,
      sipServer: updatedProxy,
      status: updatedRegister
    };

    populateTable();
    bootstrap.Modal.getInstance(document.getElementById("editModal")).hide();
  }
}

populateTable();
insertNew()