export interface ISendMail {
    email?: string;
    name?: string;
    otp: number | undefined;
    subject?: string;
}
