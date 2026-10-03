"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { moveTeamMember, removeTeamMember, saveTeamMember, translateTeamRole } from "@/app/admin/equipo/actions";
import { teamPhotoUrl, type TeamRow } from "@/lib/team/public";

const groups = [
  ["direccion", "Dirección"],
  ["counselors", "Senior Counselors"],
  ["comercial", "Comercial y países"],
  ["consultoria", "Consultoría"],
  ["sourcing", "Strategic Sourcing"],
  ["bpo", "BPO y servicios"],
  ["corporate", "Corporate"],
] as const;

const fieldClass =
  "mt-1 w-full border border-xinergy-charcoal/15 bg-white px-3 py-2 text-sm outline-none focus:border-xinergy-orange";

function frame(value: string) {
  const parts = [...value.matchAll(/(\d+)%/g)].map((match) => Number(match[1]));
  if (parts.length >= 2) return { x: parts[0], y: parts[1] };
  if (parts.length === 1 && /center/i.test(value)) return { x: 50, y: parts[0] };
  return { x: parts[0] ?? 50, y: 20 };
}

function photoStyle(member: {
  grayscale: boolean;
  brightness: number;
  contrast: number;
  objectPosition: string;
  zoom: number;
}) {
  return {
    objectPosition: member.objectPosition,
    transform: `scale(${member.zoom / 100})`,
    filter: `${member.grayscale ? "grayscale(1) " : ""}contrast(${member.contrast / 100}) brightness(${member.brightness / 100})`,
  };
}

function PersonEditor({ member }: { member: TeamRow }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(member.name);
  const [groupKey, setGroupKey] = useState(member.group_key);
  const [roleEs, setRoleEs] = useState(member.role_es);
  const [roleEn, setRoleEn] = useState(member.role_en);
  const [rolePt, setRolePt] = useState(member.role_pt);
  const initialFrame = frame(member.object_position);
  const [positionX, setPositionX] = useState(initialFrame.x);
  const [positionY, setPositionY] = useState(initialFrame.y);
  const [zoom, setZoom] = useState(member.zoom || 106);
  const [grayscale, setGrayscale] = useState(member.grayscale);
  const [brightness, setBrightness] = useState(member.brightness);
  const [contrast, setContrast] = useState(member.contrast);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const photo = teamPhotoUrl(member.image_path);
  const objectPosition = `${positionX}% ${positionY}%`;
  const style = photoStyle({ grayscale, brightness, contrast, objectPosition, zoom });

  async function save() {
    setBusy(true);
    setError(null);
    const result = await saveTeamMember({
      id: member.id,
      name,
      groupKey,
      roleEs,
      roleEn,
      rolePt,
      objectPosition,
      zoom,
      grayscale,
      brightness,
      contrast,
    });
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  async function translate() {
    setBusy(true);
    setError(null);
    const result = await translateTeamRole(roleEs);
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setRoleEn(result.en);
    setRolePt(result.pt);
  }

  async function upload(file: File) {
    setBusy(true);
    setError(null);
    const form = new FormData();
    form.set("id", member.id);
    form.set("photo", file);
    const response = await fetch("/api/admin/team/photo", { method: "POST", body: form });
    setBusy(false);
    if (!response.ok) {
      setError("No se pudo cargar la foto.");
      return;
    }
    router.refresh();
  }

  return (
    <li className="border border-xinergy-charcoal/10 bg-white p-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="h-16 w-16 overflow-hidden rounded-xl bg-[#f5f2ed]">
          {photo ? <img src={photo} alt="" className="h-full w-full object-cover" style={style} /> : null}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{member.name}</p>
          <p className="text-sm text-xinergy-slate">{member.role_es || "Sin cargo"}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="border border-xinergy-charcoal/15 px-2 py-1 text-xs" onClick={() => void moveTeamMember(member.id, "up").then(() => router.refresh())}>
            Subir
          </button>
          <button type="button" className="border border-xinergy-charcoal/15 px-2 py-1 text-xs" onClick={() => void moveTeamMember(member.id, "down").then(() => router.refresh())}>
            Bajar
          </button>
          <button type="button" className="border border-xinergy-charcoal/15 px-2 py-1 text-xs" onClick={() => setOpen((value) => !value)}>
            {open ? "Cerrar" : "Editar"}
          </button>
          <button
            type="button"
            className="px-2 py-1 text-xs text-red-700"
            onClick={() => {
              if (!confirm(`¿Quitar a ${member.name}?`)) return;
              void removeTeamMember(member.id).then(() => router.refresh());
            }}
          >
            Quitar
          </button>
        </div>
      </div>
      {open ? (
        <div className="mt-4 grid gap-4 lg:grid-cols-[9rem_minmax(0,1fr)]">
          <div>
            <div className="aspect-square overflow-hidden rounded-xl bg-[#f5f2ed]">
              {photo ? <img src={photo} alt="" className="h-full w-full object-cover" style={style} /> : null}
            </div>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="mt-2 block w-full text-xs"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void upload(file);
              }}
            />
          </div>
          <div className="space-y-3">
            <label className="block text-sm">
              Nombre
              <input value={name} onChange={(event) => setName(event.target.value)} className={fieldClass} />
            </label>
            <label className="block text-sm">
              Grupo
              <select value={groupKey} onChange={(event) => setGroupKey(event.target.value)} className={fieldClass}>
                {groups.map(([id, label]) => (
                  <option key={id} value={id}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              Cargo en español
              <input value={roleEs} onChange={(event) => setRoleEs(event.target.value)} className={fieldClass} />
            </label>
            <button type="button" disabled={busy} onClick={() => void translate()} className="border border-xinergy-charcoal/20 px-3 py-2 text-sm font-semibold disabled:opacity-60">
              Traducir con IA
            </button>
            <label className="block text-sm">
              Cargo en inglés
              <input value={roleEn} onChange={(event) => setRoleEn(event.target.value)} className={fieldClass} />
            </label>
            <label className="block text-sm">
              Cargo en portugués
              <input value={rolePt} onChange={(event) => setRolePt(event.target.value)} className={fieldClass} />
            </label>
            <label className="block text-sm">
              Encuadre horizontal ({positionX}%)
              <input type="range" min={0} max={100} value={positionX} onChange={(event) => setPositionX(Number(event.target.value))} className="mt-2 w-full" />
            </label>
            <label className="block text-sm">
              Encuadre vertical ({positionY}%)
              <input type="range" min={0} max={80} value={positionY} onChange={(event) => setPositionY(Number(event.target.value))} className="mt-2 w-full" />
            </label>
            <label className="block text-sm">
              Zoom ({zoom}%)
              <input type="range" min={100} max={180} value={zoom} onChange={(event) => setZoom(Number(event.target.value))} className="mt-2 w-full" />
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={grayscale} onChange={(event) => setGrayscale(event.target.checked)} />
              Blanco y negro
            </label>
            <label className="block text-sm">
              Brillo ({brightness})
              <input type="range" min={70} max={150} value={brightness} onChange={(event) => setBrightness(Number(event.target.value))} className="mt-2 w-full" />
            </label>
            <label className="block text-sm">
              Contraste ({contrast})
              <input type="range" min={70} max={150} value={contrast} onChange={(event) => setContrast(Number(event.target.value))} className="mt-2 w-full" />
            </label>
            {error ? <p className="text-sm text-red-700">{error}</p> : null}
            <button type="button" disabled={busy} onClick={() => void save()} className="bg-xinergy-orange px-4 py-2 text-sm font-semibold disabled:opacity-60">
              {busy ? "Guardando…" : "Guardar"}
            </button>
          </div>
        </div>
      ) : null}
    </li>
  );
}

export function TeamAdmin({ members }: { members: TeamRow[] }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function add() {
    const result = await saveTeamMember({
      name: "Nuevo integrante",
      groupKey: "direccion",
      roleEs: "",
      roleEn: "",
      rolePt: "",
      objectPosition: "50% 20%",
      zoom: 106,
      grayscale: true,
      brightness: 102,
      contrast: 104,
    });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl">Equipo</h1>
          <p className="mt-2 max-w-xl text-sm text-xinergy-slate">
            El orden de esta lista es el de la web. El cargo se escribe en español y, si quieres, se traduce a inglés y portugués.
          </p>
        </div>
        <button type="button" onClick={() => void add()} className="bg-xinergy-orange px-4 py-2.5 text-sm font-semibold">
          Añadir
        </button>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-3">
        {members.map((member) => (
          <PersonEditor key={member.id} member={member} />
        ))}
      </ul>
    </div>
  );
}
