
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

export const workScheduleSchema = z.object({
    workDate: z.date(),
    startAt: z.date(),
    endAt: z.date(),
    expertId: z.string().min(1)
}).refine(data => new Date(`1970-01-01T${data.endAt}:00Z`) > new Date(`1970-01-01T${data.startAt}:00Z`), {
    message: "endAt must be later than startAt",
    path: ["endAt"]
});