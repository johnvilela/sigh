export interface GetTeamByIdParams {
  id: string;
  includeAthletes?: boolean;
  includeFederation?: boolean;
}

export interface GetAllTeamsParams {
  includeUsers?: boolean;
  includeFederation?: boolean;
  filter?: {
    name?: string;
    federationId?: string;
  };
}

export interface GetAllSmallTeamsParams {
  filter?: {
    federationId?: string;
  };
}