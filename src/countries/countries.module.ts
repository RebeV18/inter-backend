import { Module } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CountriesController } from './countries.controller';
import { FirebaseModule } from '../firebase/firebase.module';
import { FirestoreService } from '../firebase/firestore.service';

@Module({
  imports: [FirebaseModule],
  controllers: [CountriesController],
  providers: [CountriesService, FirestoreService],
})
export class CountriesModule {}
