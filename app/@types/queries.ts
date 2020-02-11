export interface Project
{
    name:string
}

export interface ProjectsInformation
{
    name:string;
    sum: PostgresIntervall;
}


export interface PostgresIntervall {
    years?: number;
    months?: number;
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
    milliseconds?: number;
  }

