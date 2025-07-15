import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

interface FirestoreFilter {
  field: string;
  operator: FirebaseFirestore.WhereFilterOp;
  value: any;
}

@Injectable()
export class FirestoreService {
  private readonly db: FirebaseFirestore.Firestore;

  constructor(
    @Inject('FIREBASE_APP') private firebaseApp: admin.app.App,
    private configService: ConfigService,
  ) {
    this.db = this.firebaseApp.firestore();
  }

  async create(collection: string, data: any) {
    try {
      const docRef = await this.db.collection(collection).add({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const doc = await docRef.get();
      return {
        id: doc.id,
        ...doc.data(),
      };
    } catch (error) {
      throw new Error(`Error creating document: ${error.message}`);
    }
  }

  async findAll(
    collection: string,
    filters: FirestoreFilter[] = [],
    limit = 20,
    startAfter?: string,
  ) {
    try {
      let query: FirebaseFirestore.Query = this.db.collection(collection);

      filters.forEach((filter) => {
        query = query.where(filter.field, filter.operator, filter.value);
      });

      query = query.limit(limit);
      if (startAfter) {
        const doc = await this.db.collection(collection).doc(startAfter).get();
        if (doc.exists) {
          query = query.startAfter(doc);
        }
      }

      const snapshot = await query.get();
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      throw new Error(`Error fetching documents: ${error.message}`);
    }
  }

  async findOne(collection: string, id: string) {
    try {
      const doc = await this.db.collection(collection).doc(id).get();

      if (!doc.exists) {
        return null;
      }

      return {
        id: doc.id,
        ...doc.data(),
      };
    } catch (error) {
      throw new Error(`Error fetching document: ${error.message}`);
    }
  }

  async update(collection: string, id: string, data: any) {
    try {
      const docRef = this.db.collection(collection).doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        throw new Error('Document not found');
      }

      await docRef.update({
        ...data,
        updatedAt: new Date(),
      });

      const updatedDoc = await docRef.get();
      return {
        id: updatedDoc.id,
        ...updatedDoc.data(),
      };
    } catch (error) {
      throw new Error(`Error updating document: ${error.message}`);
    }
  }

  async remove(collection: string, id: string) {
    try {
      const docRef = this.db.collection(collection).doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        throw new Error('Document not found');
      }

      await docRef.delete();
      return { id, deleted: true };
    } catch (error) {
      throw new Error(`Error deleting document: ${error.message}`);
    }
  }

  async findWithQuery(
    collection: string,
    queryBuilder: (query: FirebaseFirestore.Query) => FirebaseFirestore.Query,
  ) {
    try {
      const baseQuery = this.db.collection(collection);
      const query = queryBuilder(baseQuery);
      const snapshot = await query.get();

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      throw new Error(`Error executing query: ${error.message}`);
    }
  }

  // Método para verificar la conexión
  async testConnection(): Promise<boolean> {
    try {
      // Intentar hacer una consulta simple
      await this.db.collection('_health').limit(1).get();
      return true;
    } catch (error) {
      console.error('Firebase connection test failed:', error);
      return false;
    }
  }

  async updateArrayField(
    collection: string,
    id: string,
    fieldPath: string,
    operation: 'add' | 'remove' | 'update',
    value: any,
    index?: number,
  ) {
    try {
      const docRef = this.db.collection(collection).doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        throw new Error('Document not found');
      }

      const data = doc.data();
      const currentArray = data?.[fieldPath] || [];

      let result;
      switch (operation) {
        case 'add':
          await docRef.update({
            [fieldPath]: admin.firestore.FieldValue.arrayUnion(value),
            updatedAt: new Date(),
          });
          result = [...currentArray, value];
          break;
        case 'remove':
          await docRef.update({
            [fieldPath]: admin.firestore.FieldValue.arrayRemove(
              currentArray[index],
            ),
            updatedAt: new Date(),
          });
          result = currentArray.filter((item: any, i: number) => i !== index);
          break;
        case 'update': {
          if (index === undefined) {
            throw new Error('Index required for update operation');
          }
          const newArray = [...currentArray];
          newArray[index] = value;
          await docRef.update({
            [fieldPath]: newArray,
            updatedAt: new Date(),
          });
          result = newArray;
          break;
        }
        default:
          throw new Error('Invalid operation');
      }

      return result;
    } catch (error) {
      throw new Error(`Error updating array field: ${error.message}`);
    }
  }
}
