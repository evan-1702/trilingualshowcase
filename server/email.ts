import nodemailer from 'nodemailer';
import type { Reservation } from '@shared/schema';

// Configuration SMTP par défaut (sera configurable via l'admin)
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export async function sendReservationConfirmationEmail(
  reservation: Reservation,
  siteEmail: string
): Promise<boolean> {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('SMTP credentials not configured, skipping email');
    return false;
  }

  try {
    const transporter = createTransporter();
    const animals = JSON.parse(reservation.animals);
    
    // Email to customer
    const customerEmailOptions = {
      from: `"Pet Paradise" <${process.env.SMTP_USER}>`,
      to: reservation.customerEmail,
      subject: 'Confirmation de votre demande de réservation - Pet Paradise',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #8B6F5B; color: white; padding: 20px; text-align: center;">
            <h1>Pet Paradise</h1>
            <h2>Confirmation de demande de réservation</h2>
          </div>
          
          <div style="padding: 20px;">
            <p>Bonjour ${reservation.customerFirstName} ${reservation.customerName},</p>
            
            <p>Nous avons bien reçu votre demande de réservation pour un séjour du <strong>${reservation.startDate}</strong> au <strong>${reservation.endDate}</strong>.</p>
            
            <div style="background-color: #F9F5EF; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3>Détails de votre demande :</h3>
              <ul>
                <li><strong>Dates :</strong> Du ${reservation.startDate} au ${reservation.endDate}</li>
                <li><strong>Nombre d'animaux :</strong> ${reservation.numberOfAnimals}</li>
                <li><strong>Animaux :</strong> ${animals.map((animal: any) => `${animal.name} (${animal.type})`).join(', ')}</li>
              </ul>
            </div>
            
            <p><strong>Prochaines étapes :</strong></p>
            <ul>
              <li>Nous allons examiner votre demande dans les plus brefs délais</li>
              <li>Vous recevrez une confirmation définitive par email sous 24-48h</li>
              <li>En cas de questions, n'hésitez pas à nous contacter</li>
            </ul>
            
            <p>Merci de votre confiance,<br>L'équipe Pet Paradise</p>
            
            <div style="background-color: #F0EAE2; padding: 15px; border-radius: 5px; margin-top: 30px; text-align: center;">
              <p style="margin: 0; font-size: 14px; color: #666;">
                Cet email est envoyé automatiquement, merci de ne pas y répondre directement.<br>
                Pour toute question, contactez-nous à : ${siteEmail}
              </p>
            </div>
          </div>
        </div>
      `
    };

    // Email to site admin
    const adminEmailOptions = {
      from: `"Pet Paradise System" <${process.env.SMTP_USER}>`,
      to: siteEmail,
      subject: `Nouvelle demande de réservation - ${reservation.customerFirstName} ${reservation.customerName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #8B6F5B; color: white; padding: 20px; text-align: center;">
            <h1>Pet Paradise - Administration</h1>
            <h2>Nouvelle demande de réservation</h2>
          </div>
          
          <div style="padding: 20px;">
            <p>Une nouvelle demande de réservation a été reçue :</p>
            
            <div style="background-color: #F9F5EF; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3>Informations client :</h3>
              <ul>
                <li><strong>Nom :</strong> ${reservation.customerFirstName} ${reservation.customerName}</li>
                <li><strong>Email :</strong> ${reservation.customerEmail}</li>
                <li><strong>Téléphone :</strong> ${reservation.customerPhone}</li>
                <li><strong>Adresse :</strong> ${reservation.customerAddress}</li>
              </ul>
            </div>
            
            <div style="background-color: #F0EAE2; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3>Détails du séjour :</h3>
              <ul>
                <li><strong>Dates :</strong> Du ${reservation.startDate} au ${reservation.endDate}</li>
                <li><strong>Nombre d'animaux :</strong> ${reservation.numberOfAnimals}</li>
                <li><strong>Animaux :</strong> ${animals.map((animal: any) => `${animal.name} (${animal.type})`).join(', ')}</li>
              </ul>
            </div>
            

            
            <p><strong>Action requise :</strong> Veuillez traiter cette demande dans l'interface d'administration.</p>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.BASE_URL || 'http://localhost:5000'}/paradise-management/reservations" 
                 style="background-color: #8B6F5B; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                Accéder à l'administration
              </a>
            </div>
          </div>
        </div>
      `
    };

    // Send both emails
    await Promise.all([
      transporter.sendMail(customerEmailOptions),
      transporter.sendMail(adminEmailOptions)
    ]);

    console.log('Reservation emails sent successfully via SMTP');
    return true;
  } catch (error) {
    console.error('Error sending reservation emails:', error);
    return false;
  }
}