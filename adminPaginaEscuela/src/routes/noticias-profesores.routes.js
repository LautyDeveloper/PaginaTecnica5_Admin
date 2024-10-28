import { Router } from "express";
import pool from "../database.js";

const router = Router();

router.get("/noticias-profesores", async(req, res) => {
    try{
        const [result] = await pool.query('SELECT * FROM noticiasProfesores');
        res.render('noticias-profesores/noticias-profesores', {noticiasProfes: result});
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
});

router.get("/add-noticia-profesor", async (req, res) => {
  res.render("noticias-profesores/add-noticia-profesor");
});

router.post("/add-noticia-profesor", async (req, res) => {
  try {
    const { nombreNoticiaProfe, descripcionNoticiaProfe } = req.body;
    const newNoticiaProfes = { nombreNoticiaProfe, descripcionNoticiaProfe };
    await pool.query("INSERT INTO noticiasProfesores SET ?", [
      newNoticiaProfes,
    ]);
    res.redirect("/noticias-profesores");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/edit-noticia-profe/:idNoticiaProfe', async(req, res)=>{
    try{
        const {idNoticiaProfe} = req.params;
        const [noticiasProfesores] = await pool.query('SELECT * FROM noticiasProfesores WHERE idNoticiaProfe = ?', [idNoticiaProfe]);
        const noticiasProfesoresEdit = noticiasProfesores[0];
        res.render('noticias-profesores/edit-noticia-profe', {noticiasProfes: noticiasProfesoresEdit});       
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
})

router.post('/edit-noticia-profe/:idNoticiaProfe', async(req, res)=>{
    try{
        const {nombreNoticiaProfe, descripcionNoticiaProfe} = req.body;
        const {idNoticiaProfe} = req.params;
        const noticiasProfesoresEdit = {nombreNoticiaProfe, descripcionNoticiaProfe};
        await pool.query('UPDATE noticiasProfesores SET ? WHERE idNoticiaProfe = ?', [noticiasProfesoresEdit, idNoticiaProfe]);
        res.redirect('/noticias-profesores');
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
})

router.get("/delete-noticia-profe/:idNoticiaProfe", async (req, res)=>{
    try{
        const {idNoticiaProfe} = req.params;
        await pool.query('DELETE FROM noticiasProfesores WHERE idNoticiaProfe = ?', [idNoticiaProfe])
        res.redirect('/noticias-profesores');
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
})

export default router;
