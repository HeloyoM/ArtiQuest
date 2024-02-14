export interface IAbout {
    getCV(): ICV
}


export interface ICV {
    fields: Fields
    text: string
}

export interface Fields {
    name: string
    phone: string
    email: string
    linkedin: string
    github: string
    summary: string
    experience: Experience[]
    education: Education[]
    skills: Skills
}

export interface Experience {
    title: string
    company: string
    start_date: string
    end_date: string
    description: string
}

export interface Education {
    degree: string
    institution: string
    location: string
}

export interface Skills {
    backend: string
    db: string
    devops: string
    frontend: string
    linux: string
    languages: string
}
