# lib/actions.ts

- ActionResult · type · L21-L21 — type ActionResult = { ok: boolean; error?: string };
- rateLimited · function · L34-L52 — async function rateLimited(): Promise<boolean>
- deliver · function · L54-L77 — async function deliver(subject: string, text: string): Promise<ActionResult>
- submitContact · function · L95-L113 — async function submitContact( input: z.infer<typeof contactSchema> ): Promise<ActionResult>
- subscribeNewsletter · function · L121-L135 — async function subscribeNewsletter( input: z.infer<typeof emailSchema> ): Promise<ActionResult>
- notifyMe · function · L144-L158 — async function notifyMe( input: z.infer<typeof notifySchema> ): Promise<ActionResult>
- submitFeedback · function · L167-L185 — async function submitFeedback( input: z.infer<typeof feedbackSchema> ): Promise<ActionResult>
