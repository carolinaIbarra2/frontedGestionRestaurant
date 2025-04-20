import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';

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
  successMessage: string = '';
  showPasswords: boolean = false;

  constructor(private userService: UserService, private route: ActivatedRoute){}

  onSubmit(){
    const userId = Number(this.route.snapshot.paramMap.get('id'));
    
    if(this.newPassword === this.confirmationPassword){
      this.userService.updatePassword(userId, this.currentPassword, this.newPassword).subscribe({
        next: () => {   
          this.successMessage = 'Contraseña actualizada con éxito ✅. Serás redirigido al inicio de sesión para acceder nuevamente.';
          this.errorMessage = '';
        
          setTimeout(() => {
            this.userService.logout();
          }, 5000); 
        },
        error: (err) => {
          this.errorMessage = 'Error al cambiar la contraseña. Verifica contraseña actual'
        }
      });
    } else {
      this.errorMessage = 'Las contraseñas no coinciden'
    }
  }
}
