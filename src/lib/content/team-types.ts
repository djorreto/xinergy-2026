export type TeamGroup =
  | "direccion"
  | "comercial"
  | "consultoria"
  | "sourcing"
  | "bpo"
  | "corporate";

export type TeamMember = {
  name: string;
  role: string;
  image: string;
  group: TeamGroup;
  /** CSS object-position for head framing inside square crop */
  objectPosition?: string;
};
