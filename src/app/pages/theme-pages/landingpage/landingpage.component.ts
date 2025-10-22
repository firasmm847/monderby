import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { CommonModule, ViewportScroller } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { Router, RouterLink } from '@angular/router';
import { BrandingComponent } from '../../../layouts/full/vertical/sidebar/branding.component';

interface apps {
  id: number;
  img: string;
  title: string;
  subtitle: string;
  link: string;
}

interface quicklinks {
  id: number;
  title: string;
  link: string;
}

interface demos {
  id: number;
  name: string;
  subtext?: string;
  url: string;
  imgSrc: string;
}

interface testimonials {
  id: number;
  name: string;
  subtext: string;
  imgSrc: string;
}

interface features {
  id: number;
  icon: string;
  title: string;
  subtext: string;
  color: string;
}

interface Feature {
  title: string;
  description: string;
  emoji: string;
}

interface Testimonial {
  text: string;
  author: string;
  rating: number;
}

@Component({
  selector: 'app-landingpage',
  standalone: true,
  imports: [MaterialModule, TablerIconsModule, RouterLink, BrandingComponent, CommonModule],
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss']
})
export class AppLandingpageComponent {

  @Output() onGetStarted = new EventEmitter<void>();

  constructor(
    private settings: CoreService,
    private router: Router,
    private scroller: ViewportScroller
  ) {}
  
  goToLogin(){
      this.router.navigate(['/login']);
  }

  goToSignup(){
      this.router.navigate(['/side-register']);
  }

  features: Feature[] = [
    {
      title: 'Paris Sportifs',
      description: 'Pariez sur vos équipes favorites avec vos amis',
      emoji: '⚽'
    },
    {
      title: 'Défis Personnalisés',
      description: 'Créez des défis amusants du quotidien',
      emoji: '🎉'
    },
    {
      title: 'Classements',
      description: 'Grimpez dans les leaderboards',
      emoji: '🏆'
    },
    {
      title: 'Social',
      description: 'Interagissez avec vos amis',
      emoji: '💬'
    }
  ];

  testimonials: Testimonial[] = [
    {
      text: "Super app pour s'amuser entre potes ! Les défis sont géniaux 😄",
      author: "Sarah M.",
      rating: 5
    },
    {
      text: "J'adore parier sur les matchs avec mes amis, ça rend le foot encore plus fun !",
      author: "Thomas L.", 
      rating: 5
    },
    {
      text: "Interface très clean et facile à utiliser. Recommande !",
      author: "Marie K.",
      rating: 5
    }
  ];

  handleGetStarted(): void {
    this.onGetStarted.emit();
  }

  // Helper pour générer un tableau de nombres (pour les étoiles)
  getStarArray(count: number): number[] {
    return Array(count).fill(0).map((_, i) => i);
  }
}