import { useState, useEffect } from 'react';
import Table from '../../components/admin/Table';
import Badge from '../../components/admin/Badge';
import Modal from '../../components/admin/Modal';
import type { TableColumn } from '../../components/admin/Table';
import type { Job, JobStatus, JobModality, JobType } from '../../types/job.types';
import { JobStatusEnum, JobModalityEnum, JobTypeEnum } from '../../types/job.types';
import adminJobService from '../../services/adminJobService';
import './JobsSection.css';

const STATUS_LABEL: Record<JobStatus, string> = {
  [JobStatusEnum.PRIORITY]: 'Prioritario',
  [JobStatusEnum.OPEN]: 'Disponible',
  [JobStatusEnum.CLOSED]: 'Cerrado',
};

const MODALITY_LABEL: Record<JobModality, string> = {
  [JobModalityEnum.PRESENCIAL]: 'Presencial',
  [JobModalityEnum.REMOTO]: 'Remoto',
  [JobModalityEnum.HIBRIDO]: 'Híbrido',
};

const TYPE_LABEL: Record<JobType, string> = {
  [JobTypeEnum.TIEMPO_COMPLETO]: 'Tiempo completo',
  [JobTypeEnum.CONTRATO]: 'Contrato',
};

const STATUS_VARIANT: Record<JobStatus, 'warning' | 'success' | 'error'> = {
  [JobStatusEnum.PRIORITY]: 'warning',
  [JobStatusEnum.OPEN]: 'success',
  [JobStatusEnum.CLOSED]: 'error',
};

const emptyForm: Partial<Job> & { skillsStr: string } = {
  cargo: '',
  ciudad: '',
  modalidad: JobModalityEnum.PRESENCIAL,
  tipo: JobTypeEnum.TIEMPO_COMPLETO,
  descripcion: '',
  skillsStr: '',
  status: JobStatusEnum.OPEN,
};

export default function JobsSection() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [form, setForm] = useState<Partial<Job> & { skillsStr: string }>({ ...emptyForm });
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await adminJobService.getAll(1, 50);
      setJobs(result.data);
    } catch {
      setError('Error al cargar vacantes');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ ...emptyForm });
    setSaveError(null);
  };

  const openCreate = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const openEdit = (job: Job) => {
    setForm({
      cargo: job.cargo,
      ciudad: job.ciudad,
      modalidad: job.modalidad,
      tipo: job.tipo,
      descripcion: job.descripcion,
      skillsStr: (job.skills || []).join(', '),
      status: job.status,
    });
    setSelectedJob(job);
    setSaveError(null);
  };

  const handleSave = async () => {
    if (!form.cargo || !form.ciudad || !form.descripcion) {
      setSaveError('Cargo, ciudad y descripción son requeridos');
      return;
    }

    try {
      setSaving(true);
      setSaveError(null);

      const skills = form.skillsStr
        ? form.skillsStr.split(',').map((s: string) => s.trim()).filter(Boolean)
        : [];

      const payload = {
        cargo: form.cargo,
        ciudad: form.ciudad,
        modalidad: form.modalidad!,
        tipo: form.tipo!,
        descripcion: form.descripcion,
        skills,
        status: form.status!,
      };

      if (selectedJob) {
        await adminJobService.update(selectedJob._id, payload);
        setJobs((prev) =>
          prev.map((j) => (j._id === selectedJob._id ? { ...j, ...payload, _id: j._id } : j))
        );
      } else {
        const result = await adminJobService.create(payload);
        setJobs((prev) => [result.data, ...prev]);
      }

      setSelectedJob(null);
      setShowCreateModal(false);
      resetForm();
    } catch {
      setSaveError('Error al guardar la vacante');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: JobStatus) => {
    const nextStatus: JobStatus =
      currentStatus === JobStatusEnum.OPEN
        ? JobStatusEnum.PRIORITY
        : currentStatus === JobStatusEnum.PRIORITY
          ? JobStatusEnum.CLOSED
          : JobStatusEnum.OPEN;

    try {
      await adminJobService.update(id, { status: nextStatus });
      setJobs((prev) =>
        prev.map((j) => (j._id === id ? { ...j, status: nextStatus } : j))
      );
    } catch {
      alert('Error al cambiar estado');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Eliminar esta vacante?')) return;

    try {
      await adminJobService.delete(id);
      setJobs((prev) => prev.filter((j) => j._id !== id));
    } catch {
      alert('Error al eliminar la vacante');
    }
  };

  const columns: TableColumn<Job>[] = [
    {
      key: 'cargo',
      label: 'Cargo',
      render: (_value: unknown, job: Job) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {job.status === JobStatusEnum.PRIORITY && (
            <span style={{ color: 'var(--warning-color)', fontSize: '14px' }}>★</span>
          )}
          <span style={{ fontWeight: 'var(--font-weight-bold)' }}>{job.cargo}</span>
        </div>
      ),
    },
    {
      key: 'ciudad',
      label: 'Ciudad',
    },
    {
      key: 'modalidad',
      label: 'Modalidad',
      render: (_value: unknown, job: Job) => (
        <Badge variant="default" size="sm">
          {MODALITY_LABEL[job.modalidad]}
        </Badge>
      ),
    },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (_value: unknown, job: Job) => (
        <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
          {TYPE_LABEL[job.tipo]}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Estado',
      render: (_value: unknown, job: Job) => (
        <Badge variant={STATUS_VARIANT[job.status]} size="sm">
          {STATUS_LABEL[job.status]}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      label: 'Publicada',
      render: (_value: unknown, job: Job) => new Date(job.createdAt).toLocaleDateString('es-ES'),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_value: unknown, job: Job) => (
        <div className="jobs-actions">
          <button
            className="jobs-btn jobs-btn--toggle"
            onClick={(e) => { e.stopPropagation(); handleStatusToggle(job._id, job.status); }}
            title="Cambiar estado"
          >
            {job.status === JobStatusEnum.CLOSED ? 'Reabrir' : job.status === JobStatusEnum.PRIORITY ? 'Cerrar' : 'Priorizar'}
          </button>
          <button
            className="jobs-btn jobs-btn--edit"
            onClick={(e) => { e.stopPropagation(); openEdit(job); }}
          >
            Editar
          </button>
          <button
            className="jobs-btn jobs-btn--delete"
            onClick={(e) => { e.stopPropagation(); handleDelete(job._id); }}
          >
            Eliminar
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="jobs-section">
      <div className="section-header">
        <h2>Gestión de Vacantes</h2>
        <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
          <button className="btn-refresh" onClick={loadJobs} disabled={loading}>
            {loading ? 'Cargando...' : 'Actualizar'}
          </button>
          <button className="btn-primary" onClick={openCreate}>
            + Nueva Vacante
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="content-layout">
        <Table
          columns={columns}
          data={jobs}
          loading={loading}
          emptyMessage="No hay vacantes registradas"
          onRowClick={openEdit}
        />
      </div>

      <Modal
        isOpen={showCreateModal || !!selectedJob}
        onClose={() => { setShowCreateModal(false); setSelectedJob(null); resetForm(); }}
        title={selectedJob ? 'Editar Vacante' : 'Nueva Vacante'}
        size="large"
      >
        <div className="jobs-form">
          {saveError && <div className="error-message">{saveError}</div>}

          <div className="jobs-form__row">
            <div className="jobs-form__field">
              <label>Cargo *</label>
              <input
                type="text"
                value={form.cargo || ''}
                onChange={(e) => setForm({ ...form, cargo: e.target.value })}
                placeholder="Ej: Técnico en Insonorización"
                className="jobs-form__input"
              />
            </div>
            <div className="jobs-form__field">
              <label>Ciudad *</label>
              <input
                type="text"
                value={form.ciudad || ''}
                onChange={(e) => setForm({ ...form, ciudad: e.target.value })}
                placeholder="Ej: Medellín"
                className="jobs-form__input"
              />
            </div>
          </div>

          <div className="jobs-form__row">
            <div className="jobs-form__field">
              <label>Modalidad</label>
              <select
                value={form.modalidad || JobModalityEnum.PRESENCIAL}
                onChange={(e) => setForm({ ...form, modalidad: e.target.value as JobModality })}
                className="jobs-form__select"
              >
                <option value={JobModalityEnum.PRESENCIAL}>Presencial</option>
                <option value={JobModalityEnum.REMOTO}>Remoto</option>
                <option value={JobModalityEnum.HIBRIDO}>Híbrido</option>
              </select>
            </div>
            <div className="jobs-form__field">
              <label>Tipo de contrato</label>
              <select
                value={form.tipo || JobTypeEnum.TIEMPO_COMPLETO}
                onChange={(e) => setForm({ ...form, tipo: e.target.value as JobType })}
                className="jobs-form__select"
              >
                <option value={JobTypeEnum.TIEMPO_COMPLETO}>Tiempo completo</option>
                <option value={JobTypeEnum.CONTRATO}>Contrato</option>
              </select>
            </div>
          </div>

          <div className="jobs-form__row">
            <div className="jobs-form__field">
              <label>Estado</label>
              <select
                value={form.status || JobStatusEnum.OPEN}
                onChange={(e) => setForm({ ...form, status: e.target.value as JobStatus })}
                className="jobs-form__select"
              >
                <option value={JobStatusEnum.OPEN}>Disponible</option>
                <option value={JobStatusEnum.PRIORITY}>Prioritario</option>
                <option value={JobStatusEnum.CLOSED}>Cerrado</option>
              </select>
            </div>
          </div>

          <div className="jobs-form__field jobs-form__field--full">
            <label>Descripción *</label>
            <textarea
              value={form.descripcion || ''}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              placeholder="Describe las responsabilidades y requisitos del cargo..."
              className="jobs-form__textarea"
              rows={4}
            />
          </div>

          <div className="jobs-form__field jobs-form__field--full">
            <label>Habilidades (separadas por coma)</label>
            <input
              type="text"
              value={form.skillsStr || ''}
              onChange={(e) => setForm({ ...form, skillsStr: e.target.value })}
              placeholder="Ej: Aislamiento acústico, Instalación, AutoCAD"
              className="jobs-form__input"
            />
          </div>

          <div className="jobs-form__actions">
            <button
              className="btn-refresh"
              onClick={() => { setShowCreateModal(false); setSelectedJob(null); resetForm(); }}
            >
              Cancelar
            </button>
            <button
              className="btn-primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Guardando...' : selectedJob ? 'Actualizar Vacante' : 'Crear Vacante'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
