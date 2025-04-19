import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-password',
  templateUrl: './edit-password.component.html',
  styleUrls: ['./edit-password.component.css']
})
export class EditPasswordComponent {

  currentPassword: string = '';
  newPassword: string = '';
  confirmationPassword: string = '';
  errorMessage: string = '';

  constructor(private userService: UserService, private router: Router){}

  onSubmit(){
    if(this.newPassword === this.confirmationPassword){
      this.userService.updatePassword(this.currentPassword, this.newPassword).subscribe({
        next: () => {
          this.router.navigate(['/dashboard/users/detail/'])
        },
        error: (err) => {
          this.errorMessage = 'Error al cambiar la contraseña'
        }
      });
    } else {
      this.errorMessage = 'Las contraseñas no coinciden'
    }
  }
}
