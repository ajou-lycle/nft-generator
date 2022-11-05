## NFT generator server used Hash lips engine

Hash lips engine을 사용한 NFT 생성 및 뽑기 서버입니다.

API는 다음과 같이 있습니다.

+ /create-new-contract : 새로운 컬렉션을 저장하기 위한 블록체인 스마트 컨트랙트를 생성합니다. 항상 이것부터 진행해야 합니다.
+ /upload-layers-to-local : 새로운 컬렉션을 만들기 위한 이미지 레이어를 서버 로컬에 저장합니다. 각 레이어 및 이미지들은 절대 삭제되면 안 됩니다.
+ /create-new-collection : 새로운 컬렉션을 생성합니다. 생성하고자 하는 컬렉션 이름과 배치할 레이어 순서, 컬렉션 설명, 생성할 개수 등을 입력하면 됩니다.
+ /upload-nft-to-s3 : 만들어진 NFT 컬렉션을 s3에 업로드합니다. 
+ /blind-box : 뽑기용입니다. 이미 모두 뽑혔으면 모두 뽑혔다고 알려주고, 아니라면 한 개를 뽑아서 데이터를 전달합니다.

## DBMS에 만들어줘야하는 테이블 명령어

```sql
CREATE TABLE NFTS_METADATA (
	id BIGINT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(500) NOT NULL,
	dna VARCHAR(255) NOT NULL,
	json_path VARCHAR(500) NOT NULL,
	already BOOL NOT NULL
);

CREATE TABLE NFTS_LAYERS (
	id BIGINT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(500) NOT NULL,
	layers VARCHAR(500) NOT NULL
);
```