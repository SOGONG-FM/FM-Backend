const express = require("express");
const router = express.Router();
const { appleLogin } = require("../controller/authControllers");

/**
 * @swagger
 * /auth/signin:
 *   post:
 *     summary: 애플 로그인 처리
 *     description: 애플 로그인 후 사용자 인증 및 토큰 발급
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 description: 애플 로그인 시 발급되는 코드
 *                 example: abc123xyz
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: 발급된 JWT 토큰
 *       401:
 *         description: 인증 실패
 *       500:
 *         description: 서버 오류
 */
router.post("/signin", appleLogin);

module.exports = router;
