import supabase from './supabase.js'

export async function listarEmpresas() {
  const { data, error } = await supabase.from('empresas').select('*')
  if (error) throw error
  return data
}

export async function cadastrarEmpresa(novaEmpresa) {
  const { data, error } = await supabase.from('empresas').insert([novaEmpresa])
  if (error) throw error
  return data
}

export async function atualizarEmpresa(id, dadosAtualizados) {
  const { data, error } = await supabase
    .from('empresas')
    .update(dadosAtualizados)
    .eq('id', id)
  if (error) throw error
  return data
}

export async function deletarEmpresa(id) {
  const { data, error } = await supabase
    .from('empresas')
    .delete()
    .eq('id', id)
  if (error) throw error
  return data
}
