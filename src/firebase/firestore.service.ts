import { Injectable, Inject } from '@nestjs/common';
import { Firestore } from 'firebase-admin/firestore';

@Injectable()
export class FirestoreService {
  constructor(@Inject('FIRESTORE') private readonly firestore: Firestore) {}

  // Crear un documento
  async create(collection: string, data: any, id?: string) {
    try {
      if (id) {
        await this.firestore
          .collection(collection)
          .doc(id)
          .set({
            ...data,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        return { id, ...data };
      } else {
        const docRef = await this.firestore.collection(collection).add({
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        return { id: docRef.id, ...data };
      }
    } catch (error) {
      throw new Error(`Error creating document: ${error.message}`);
    }
  }

  // Obtener todos los documentos de una colección
  async findAll(
    collection: string,
    filters?: { field: string; operator: any; value: any }[],
  ) {
    try {
      let query = this.firestore.collection(collection);

      if (filters) {
        filters.forEach((filter) => {
          query = query.where(
            filter.field,
            filter.operator,
            filter.value,
          ) as any;
        });
      }

      const snapshot = await query.get();
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      throw new Error(`Error fetching documents: ${error.message}`);
    }
  }

  // Obtener un documento por ID
  async findOne(collection: string, id: string) {
    try {
      const doc = await this.firestore.collection(collection).doc(id).get();
      if (!doc.exists) {
        return null;
      }
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      throw new Error(`Error fetching document: ${error.message}`);
    }
  }

  // Actualizar un documento
  async update(collection: string, id: string, data: any) {
    try {
      await this.firestore
        .collection(collection)
        .doc(id)
        .update({
          ...data,
          updatedAt: new Date(),
        });
      return this.findOne(collection, id);
    } catch (error) {
      throw new Error(`Error updating document: ${error.message}`);
    }
  }

  // Eliminar un documento
  async remove(collection: string, id: string) {
    try {
      await this.firestore.collection(collection).doc(id).delete();
      return { deleted: true, id };
    } catch (error) {
      throw new Error(`Error deleting document: ${error.message}`);
    }
  }

  // Método para ejecutar consultas personalizadas
  async query(collection: string, queryFn: (query: any) => any) {
    try {
      const query = queryFn(this.firestore.collection(collection));
      const snapshot = await query.get();
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      throw new Error(`Error executing query: ${error.message}`);
    }
  }

  // Método para transacciones
  async runTransaction(updateFunction: (transaction: any) => Promise<any>) {
    return this.firestore.runTransaction(updateFunction);
  }
}
