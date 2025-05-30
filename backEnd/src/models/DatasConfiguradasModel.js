import supabase from '../config/SupaBase.js';

const DATAS_CONFIGURADAS_TABLE = 'datas_configuradas';

export const DatasConfiguradasModel = {
  async buscarDatasPorEmpresaPorId(empresaId) {
    const { data, error } = await supabase
      .from(DATAS_CONFIGURADAS_TABLE)
      .select('*')
      .eq('empresa_id', empresaId)
      .order('data', { ascending: true });

    if (error) throw new Error(error.message);
    return data;
  },
  async getByDataAndEmpresa(data, empresa_id) {
    const dateOnly = new Date(data).toISOString().split('T')[0]; // força yyyy-mm-dd
  
    const  result = await supabase
      .from(DATAS_CONFIGURADAS_TABLE)
      .select('*')
      .eq('data', dateOnly)
      .eq('empresa_id', empresa_id)
      .single();

    

      if (!result.data) {
        return null; 
      }
  
      if (result.error && result.error.code !== 'PGRST116') {
        throw new Error(result.error.message);
      }

    return result.data || null;
  },
  
  
  async bulkInsert(datasConfig) {
    const { data, error } = await supabase
      .from(DATAS_CONFIGURADAS_TABLE)
      .insert(datasConfig)
      .select();

    if (error) throw new Error(error.message);
    return data;
  },

  async bulkDelete(ids) {
    if (ids.length === 0) return { success: true };

    const { error } = await supabase
      .from(DATAS_CONFIGURADAS_TABLE)
      .delete()
      .in('id', ids);

    if (error) throw new Error(error.message);
    return { success: true };
  },

  async deleteById(id) {
    const { error } = await supabase
      .from(DATAS_CONFIGURADAS_TABLE)
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
    return { success: true };
  },

  async getById(id) {
    const { data, error } = await supabase
      .from(DATAS_CONFIGURADAS_TABLE)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async update(id, updates) {
    const { error } = await supabase
      .from(DATAS_CONFIGURADAS_TABLE)
      .update(updates)
      .eq('id', id);

    if (error) throw new Error(error.message);
    return { success: true };
  }
};
