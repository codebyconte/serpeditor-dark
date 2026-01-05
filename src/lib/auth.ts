import { prisma } from '@/lib/prisma'
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { nextCookies } from 'better-auth/next-js'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: 'Serpeditor <onboarding@resend.dev>',
        to: user.email,
        subject: 'Réinitialisation de votre mot de passe',
        html: `<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.06); overflow: hidden;">

          <!-- Header -->
          <tr>
            <td style="padding: 32px 30px; text-align: center; border-bottom: 1px solid #edf2f7;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #1a202c;">
            ${user?.name}
              </h1>
            </td>
          </tr>

          <!-- Contenu principal -->
          <tr>
            <td style="padding: 36px 30px;">
              <h2 style="margin: 0 0 16px; color: #2d3748; font-size: 20px; font-weight: 600;">
                Réinitialisation du mot de passe
              </h2>

              <p style="margin: 0 0 18px; color: #4a5568; font-size: 15px; line-height: 1.6;">
                Nous avons reçu une demande pour réinitialiser le mot de passe associé à votre compte.
                Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe.
              </p>

              <!-- Bouton CTA -->
              <table role="presentation" style="margin: 26px 0;">
                <tr>
                  <td style="text-align: center;">
                    <a href="${url}"
                       style="display: inline-block; padding: 12px 36px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 15px; font-weight: 600; box-shadow: 0 3px 10px rgba(37,99,235,0.18);"
                       target="_blank" rel="noopener noreferrer">
                      Réinitialiser mon mot de passe
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 12px; color: #718096; font-size: 14px; line-height: 1.5;">
                Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :
              </p>
              <p style="margin: 10px 0; padding: 12px; background-color: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 6px; color: #2d3748; font-size: 13px; word-break: break-all;">
                ${url}
              </p>
            </td>
          </tr>

          <!-- Informations importantes -->
          <tr>
            <td style="padding: 0 30px 24px;">
              <div style="background-color: #fff7ed; border-left: 4px solid #f59e0b; padding: 14px; border-radius: 6px;">
                <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.5;">
                  ⚠️ <strong>Important :</strong> Ce lien est valable 24 heures pour des raisons de sécurité.<br>
                  Si vous n’avez pas demandé cette réinitialisation, ignorez simplement cet e-mail. Si vous avez des inquiétudes, contactez notre support.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 22px 25px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 8px; color: #4a5568; font-size: 13px;">
                Besoin d’aide ? Contactez notre support : <a href="mailto:contact@codebyconte.fr" style="color: #2563eb; text-decoration: none;">contact@codebyconte.fr</a>
              </p>
              <p style="margin: 0; color: #a0aec0; font-size: 12px;">
                © 2025 Serpeditor — Tous droits réservés
              </p>
            </td>
          </tr>

        </table>

        <!-- Note de sécurité -->
        <table role="presentation" style="max-width: 600px; margin: 18px auto 0;">
          <tr>
            <td style="text-align: center; padding: 0 20px;">
              <p style="margin: 0; color: #a0aec0; font-size: 12px; line-height: 1.5;">
                Cet e-mail a été envoyé car une demande de réinitialisation a été effectuée pour un compte associé à cette adresse.<br>
                Ne partagez jamais ce lien. Pour votre sécurité, Serpeditor ne vous demandera jamais votre mot de passe par e-mail.
              </p>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>`,
      })
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }: { user: { email: string }; url: string }) => {
      await resend.emails.send({
        from: 'Serpeditor <onboarding@resend.dev>',
        to: user.email,
        subject: 'Activez votre compte SerpEditor',
        html: `
         <body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06); overflow: hidden;">

          <!-- Header -->
          <tr>
            <td style="padding: 40px 30px; text-align: center; border-bottom: 1px solid #edf2f7;">
              <h1 style="margin: 0; font-size: 26px; font-weight: 700; color: #1a202c;">
                SerpEditor
              </h1>
            </td>
          </tr>

          <!-- Contenu principal -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px; color: #2d3748; font-size: 22px; font-weight: 600;">
                Bienvenue sur SerpEditor
              </h2>

              <p style="margin: 0 0 20px; color: #4a5568; font-size: 16px; line-height: 1.6;">
                Merci pour votre inscription !
                Pour activer votre compte, cliquez simplement sur le bouton ci-dessous :
              </p>

              <!-- Bouton CTA -->
              <table role="presentation" style="margin: 30px 0;">
                <tr>
                  <td style="text-align: center;">
                    <a href="${url}"
                       style="display: inline-block; padding: 14px 36px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600; box-shadow: 0 3px 10px rgba(37, 99, 235, 0.2);">
                      Vérifier mon email
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 25px 0 0; color: #718096; font-size: 14px; line-height: 1.5;">
                Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :
              </p>
              <p style="margin: 10px 0; padding: 12px; background-color: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 6px; color: #2d3748; font-size: 13px; word-break: break-all;">
                ${url}
              </p>
            </td>
          </tr>

          <!-- Informations importantes -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <div style="background-color: #fef2f2; border-left: 4px solid #f87171; padding: 14px; border-radius: 6px;">
                <p style="margin: 0; color: #742a2a; font-size: 14px; line-height: 1.5;">
                  ⚠️ <strong>Important :</strong> Ce lien expire dans 24 heures pour des raisons de sécurité.<br>
                  Si vous n’avez pas créé de compte, vous pouvez ignorer cet email.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 25px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 8px; color: #4a5568; font-size: 14px;">
                Besoin d’aide ? Contactez notre support
              </p>
              <p style="margin: 0; color: #a0aec0; font-size: 12px;">
                © ${new Date().getFullYear()} SerpEditor — Tous droits réservés
              </p>
            </td>
          </tr>

        </table>

        <!-- Note de sécurité -->
        <table role="presentation" style="max-width: 600px; margin: 20px auto 0;">
          <tr>
            <td style="text-align: center; padding: 0 20px;">
              <p style="margin: 0; color: #a0aec0; font-size: 12px; line-height: 1.5;">
                Cet email vous a été envoyé car vous avez créé un compte sur SerpEditor.<br>
                Ne partagez jamais ce lien avec qui que ce soit.
              </p>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>

        `,
      })
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      prompt: 'select_account consent',
      accessType: 'offline',
      scope: ['https://www.googleapis.com/auth/webmasters.readonly'],
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ['google'],
      updateUserInfoOnLink: true,
      allowDifferentEmails: true,
    },
  },
  plugins: [nextCookies()],
})
