# notes-drill

### github上のpagesのサイトを更新

```
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

`sh ./scripts/deploy.sh`

### 総合スコア
総合スコア ＝ 正解率 / クリアタイム
