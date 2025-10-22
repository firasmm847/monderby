import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TablerIconsModule } from 'angular-tabler-icons';
import { PaymentService } from './payment.service';
import { loadStripe, StripeCardElement } from '@stripe/stripe-js';

// card 1
interface rules {
  title: string;
  limit: boolean;
}

interface pricecards {
  id: number;
  imgSrc: string;
  plan: string;
  btnText: string;
  free: boolean;
  planPrice?: Number;
  popular?: boolean;
  rules: rules[];
}

@Component({
    selector: 'app-pricing',
    imports: [TablerIconsModule, MatCardModule, MatSlideToggleModule, MatButtonModule, MatSlideToggleModule],
    templateUrl: './pricing.component.html',
})
export class AppPricingComponent {
  show = false;
  card: StripeCardElement | null = null;
  stripe: any;
  packType : string;
  stripePromise = loadStripe('pk_test_51R22CFFS8kUFVqJj4cE66DnsTM1xsCqvOPSU1mOCpySLeQRospuLJUmpPl1B0RZgtsYyOEdMJiwBC3BTvFWaqm5Y00OA1aOX3Z');

  constructor(private paymentService: PaymentService) {}

  // yearlyPrice: any = (a: any, b: number) => ;

  yearlyPrice(a: any) {
    return a * 12;
  }

  // card 1
  pricecards: pricecards[] = [
    {
      id: 1,
      plan: 'Silver',
      imgSrc: '/assets/images/backgrounds/silver.png',
      btnText: 'Choose Silver',
      free: true,
      rules: [
        {
          title: '3 Members',
          limit: true,
        },
        {
          title: 'Single Device',
          limit: true,
        },
        {
          title: '50GB Storage',
          limit: false,
        },
        {
          title: 'Monthly Backups',
          limit: false,
        },
        {
          title: 'Permissions & workflows',
          limit: false,
        },
      ],
    },
    {
      id: 2,
      plan: 'Bronze',
      imgSrc: '/assets/images/backgrounds/bronze.png',
      btnText: 'Choose Bronze',
      free: false,
      popular: true,
      planPrice: 10.99,
      rules: [
        {
          title: '5 Members',
          limit: true,
        },
        {
          title: 'Multiple Device',
          limit: true,
        },
        {
          title: '80GB Storage',
          limit: false,
        },
        {
          title: 'Monthly Backups',
          limit: false,
        },
        {
          title: 'Permissions & workflows',
          limit: false,
        },
      ],
    },
    {
      id: 3,
      plan: 'Gold',
      imgSrc: '/assets/images/backgrounds/gold.png',
      btnText: 'Choose Gold ',
      free: false,
      planPrice: 22.99,
      rules: [
        {
          title: 'Unlimited Members',
          limit: true,
        },
        {
          title: 'Multiple  Device',
          limit: true,
        },
        {
          title: '150GB  Storage',
          limit: true,
        },
        {
          title: 'Monthly Backups',
          limit: true,
        },
        {
          title: 'Permissions & workflows',
          limit: true,
        },
      ],
    },
  ];

  async checkout(packType: string) {
    console.log("pricin clicked")
    const stripe = await this.stripePromise;
    //const { token, error } = await this.stripe.createToken(this.card);
    this.paymentService.createCheckoutSession({ packType: packType }).subscribe(async session => {
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId: session.id });
      }
    });
  }

  async pay() {
    if (!this.card) {
      console.error('Stripe card element is not loaded');
      return;
    }

    const { token, error } = await this.stripe.createToken(this.card);

    if (error) {
      console.error(error);
      return;
    }

    this.paymentService.charge({ token: token.id, packType: 'pack_500' }).subscribe(
      response => {
        console.log('Payment success:', response);
        if (response.status === 'success') {
          console.log('Paiement réussi:', response.charge);
          // Afficher un message à l'utilisateur
          alert(`Paiement réussi : ${response.charge.amount / 100} ${response.charge.currency.toUpperCase()}`);
        } else {
            console.error('Échec du paiement');
        }
        // Gérer le succès du paiement
      },
      error => {
        console.error('Payment error:', error);
        // Gérer l'erreur de paiement
      }
    );
  }
}
