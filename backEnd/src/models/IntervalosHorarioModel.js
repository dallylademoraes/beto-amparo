import supabase from '../config/SupaBase.js';

const INTERVALOS_HORARIO_TABLE = 'intervalos_horario';

export const IntervalosHorarioModel = {
  async getByDataConfigId(dataConfigId) {
    const { data, error } = await supabase
      .from(INTERVALOS_HORARIO_TABLE)
      .select('*')
      .eq('data_config_id', dataConfigId)
      .order('inicio', { ascending: true });

    if (error) throw new Error(error.message);
    return data;
  },

  async getByDataConfigIds(dataConfigIds) {
    if (dataConfigIds.length === 0) return [];

    const { data, error } = await supabase
      .from(INTERVALOS_HORARIO_TABLE)
      .select('*')
      .in('data_config_id', dataConfigIds)
      .order('inicio', { ascending: true });

    if (error) throw new Error(error.message);
    return data;
  },

  async bulkInsert(intervalos) {
    if (intervalos.length === 0) return [];

    const { data, error } = await supabase
      .from(INTERVALOS_HORARIO_TABLE)
      .insert(intervalos)
      .select();

    if (error) throw new Error(error.message);
    return data;
  },

  async deleteByDataConfigIds(dataConfigIds) {
    if (dataConfigIds.length === 0) return { success: true };

    const { error } = await supabase
      .from(INTERVALOS_HORARIO_TABLE)
      .delete()
      .in('data_config_id', dataConfigIds);

    if (error) throw new Error(error.message);
    return { success: true };
  },

  async deleteByIds(ids) {
    if (ids.length === 0) return { success: true };

    const { error } = await supabase
      .from(INTERVALOS_HORARIO_TABLE)
      .delete()
      .in('id', ids);

    if (error) throw new Error(error.message);
    return { success: true };
  },

  async deleteByDataConfigId(dataConfigId) {
    const { error } = await supabase
      .from(INTERVALOS_HORARIO_TABLE)
      .delete()
      .eq('data_config_id', dataConfigId);

    if (error) throw new Error(error.message);
    return { success: true };
  }
};
