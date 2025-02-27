
import { z } from "zod"

export const loginSchema = z.object({
    username: z.string().min(1),
    password: z.string().min(3)
})

export const serviceSchema = z.object({
    serviceName: z.string().min(1),
    price: z.string().min(1),
    duration: z.string().min(1),
    type: z.string().min(1),
    description: z.string().optional()
})

export const blogSchema = z.object({
    title: z.string().min(1),
    content: z.string().min(1)
})

export const userSchema = z.object({
    username: z.string().min(1),
    password: z.string().min(3),
    email: z.string().email()
})

export const postSchema = z.object({
    title: z.string().min(1),
    content: z.string().min(1),
    description: z.string().optional()
})