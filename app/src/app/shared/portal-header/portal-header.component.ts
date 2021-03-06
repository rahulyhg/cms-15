import {Component, Input} from '@angular/core';
import {UserStore} from '../../api/services/user.store';
import {User} from '../../../models/responses';
import {UserService} from '../../api/services/user.service';
import {Permissions} from '../../api/guards/permissions';

interface MenuItem {
  href: string;
  text: string;
  exact: boolean;
}

@Component({
  selector: 'portal-header',
  templateUrl: 'portal-header.component.html'
})
export class PortalHeaderComponent {
  @Input() title: string;
  links: MenuItem[];
  authenticated: boolean;
  user: User;

  constructor(private userService: UserService, private userStore: UserStore) {
    this.authenticated = this.userService.isAuthenticated();
    this.userStore.changes.subscribe((user: User) => this.user = user);
  }

  ngOnInit() {
    this.links = this.getMenuItems();
  }

  ngDoCheck() {
    this.authenticated = this.userService.isAuthenticated();
    this.links = this.getMenuItems();
  }

  getMenuItems(): MenuItem[] {
    let items: MenuItem[] = [];

    items.push({href: '/', text: 'Strona Główna', exact: true});

    if (this.authenticated) {
      if (Permissions.canAccessAdminPanel(this.user.role)) {
        items.push({href: '/admin', text: 'Administracja', exact: false});
      }
      items.push({href: '/auth/settings', text: 'Ustawienia', exact: true});
      items.push({href: '/auth/logout', text: 'Wyloguj', exact: true});

    } else {
      items.push({href: '/auth/login', text: 'Zaloguj', exact: true});
    }

    return items;
  }
}
