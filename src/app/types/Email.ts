export type EmailAttachment = {
    path?: string;
    filename: string;
    content: Buffer | string;
    content_type?: string;
};

export type SenderEmailData = {
    from: string;
    to: string | string[];
    cc?: string | string[];
    bcc?: string | string[];
    subject: string;
    html: string;
    text?: string;
    scheduled_at?: string; //Schedule email to be sent later. The date should be in natural language (e.g.: in 1 min) or ISO 8601 format (e.g: 2024-08-05T11:52:01.858Z).
    attachments?: EmailAttachment[];
};
