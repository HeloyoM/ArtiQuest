import { SetMetadata } from '@nestjs/common'

export const RESOURCES_KEY = '__resources__'
export const Resources = (...resources: string[]) => SetMetadata(RESOURCES_KEY, resources)
