# notes-drill

### github上のpagesのサイトを更新

```bash
#!/bin/bash
# deploy.sh
# gh-pagesブランチでpushするこどでgithub側のactionにより
# webページをデプロイする

# mainブランチに切り替え
git checkout main

# mainブランチの最新の変更をプッシュ
git add .
git commit -m "Update main branch with latest changes"
git push origin main

# gh-pagesブランチに切り替え
git checkout gh-pages

# mainブランチの変更をマージ
git merge main

# gh-pagesブランチの変更をプッシュ
git push --force origin gh-pages

# mainブランチに戻る
git checkout main
```

### 実行方法
`sh ./scripts/deploy.sh`

### debug環境

---
### テスト環境
```bash
# カレントディレクトリを簡易Webサーバとして起動
python -m http.server 8000
# http://localhost:8000で起動できる

```

---
### 総合スコアの求め方メモ
総合スコア ＝ 正解率 / クリアタイム
