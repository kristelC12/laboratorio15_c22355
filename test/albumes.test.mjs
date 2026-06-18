import { describe, test, expect } from 'vitest';
import request from 'supertest';
import app from '../index.js';

describe('Pruebas DiscoStore API',()=>{


    test('GET /albumes - listar albumes', async()=>{

        const response = await request(app)
            .get('/albumes');

        expect(response.statusCode)
            .toBe(200);

        expect(Array.isArray(response.body))
            .toBe(true);

        expect(
            response.body.some(
                album => album.slug === "thriller"
            )
        ).toBe(true);

    });



    test('GET /album/:slug existente', async()=>{

        const response = await request(app)
            .get('/album/thriller');


        expect(response.statusCode)
            .toBe(200);

        expect(response.body.slug)
            .toBe("thriller");

    });



    test('GET /album/:slug inexistente', async()=>{

        const response = await request(app)
            .get('/album/no-existe');


        expect(response.statusCode)
            .toBe(404);

        expect(response.body.mensaje)
            .toBeDefined();

    });



    test('GET /search/:text con menos de 3 caracteres', async()=>{

        const response = await request(app)
            .get('/search/a');


        expect(response.statusCode)
            .toBe(400);

        expect(response.body)
            .toBeDefined();

    });



    test('POST /albumes válido', async()=>{

        const album = {

            titulo:"Nuevo Album",
            artista:"Artista prueba",
            genero:"Pop",
            anio:2025,
            sello:"Test",
            pistas:10,
            imagen:"test.avif",
            slug:"nuevo-album",
            resumen:"Album prueba",
            descripcion:"Descripcion prueba"

        };


        const response = await request(app)
            .post('/albumes')
            .send(album);



        expect(response.statusCode)
            .toBe(201);


        expect(response.headers.location)
            .toBe('/album/nuevo-album');


        expect(response.body.slug)
            .toBe("nuevo-album");

    });



    test('POST /albumes cuerpo inválido', async()=>{


        const response = await request(app)
            .post('/albumes')
            .send({
                titulo:"Sin datos"
            });



        expect(response.statusCode)
            .toBe(400);


        expect(response.body)
            .toBeDefined();

    });



    test('POST /albumes slug duplicado', async()=>{


        const response = await request(app)
            .post('/albumes')
            .send({

                titulo:"Thriller",
                artista:"Michael Jackson",
                genero:"Pop",
                anio:1982,
                sello:"Epic",
                pistas:9,
                imagen:"thriller.avif",
                slug:"thriller",
                resumen:"Prueba",
                descripcion:"Prueba"

            });


        expect(response.statusCode)
            .toBe(409);


        expect(response.body)
            .toBeDefined();

    });



    test('PUT /album/:slug existente', async()=>{


        const response = await request(app)
            .put('/album/thriller')
            .send({

                titulo:"Thriller actualizado",
                artista:"Michael Jackson",
                genero:"Pop",
                anio:1982,
                sello:"Epic",
                pistas:10,
                imagen:"thriller.avif",
                slug:"thriller",
                resumen:"Actualizado",
                descripcion:"Nueva descripcion"

            });



        expect(response.statusCode)
            .toBe(200);


        expect(response.body.titulo)
            .toBe("Thriller actualizado");


    });



    test('PUT /album/:slug inexistente', async()=>{


        const response = await request(app)
            .put('/album/no-existe')
            .send({

                titulo:"Test",
                artista:"Test",
                genero:"Pop",
                anio:2025,
                sello:"Test",
                pistas:5,
                imagen:"test.avif",
                slug:"no-existe",
                resumen:"Test",
                descripcion:"Test"

            });


        expect(response.statusCode)
            .toBe(404);

    });



    test('DELETE /album/:slug existente', async()=>{


        const response = await request(app)
            .delete('/album/nuevo-album');


        expect(response.statusCode)
            .toBe(204);


        expect(response.text)
            .toBe("");

    });



    test('DELETE /album/:slug inexistente', async()=>{


        const response = await request(app)
            .delete('/album/no-existe');


        expect(response.statusCode)
            .toBe(404);


        expect(response.body)
            .toBeDefined();

    });


});