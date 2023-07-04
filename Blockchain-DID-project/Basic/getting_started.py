#  클라이언트 만들기
# from socket import *
# from select import *
# import sys
# from time import ctime

# HOST = '127.0.0.1'
# PORT = 10000
# BUFSIZE = 1024
# ADDR = (HOST,PORT)

# clientSocket = socket(AF_INET, SOCK_STREAM)  # 서버에 접속하기 위한 소켓을 생성한다.

# try:
#     clientSocket.connect(ADDR)  # 서버에 접속을 시도한다.

# except  Exception as e:
#     print('%s:%s' % ADDR)
#     sys.exit()

# print('connect is success')

# while True:
#     sendData = input("input data : ")
#     clientSocket.send(sendData.encode())

import time

from indy import anoncreds, crypto, did, ledger, pool, wallet

import json
import logging
from typing import Optional

from indy.error import ErrorCode, IndyError

from src.utils import get_pool_genesis_txn_path, run_coroutine, PROTOCOL_VERSION
import subprocess
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

async def run():
     bashCommand = "bash refresh.sh"
     process = subprocess.Popen(bashCommand.split(), stdout=subprocess.PIPE)
     output, error = process.communicate()
 
     logger.info("Getting started -> started")
 
     pool_name = 'pool1'
     logger.info("Open Pool Ledger: {}".format(pool_name))
     pool_genesis_txn_path = get_pool_genesis_txn_path(pool_name)
     pool_config = json.dumps({"genesis_txn": str(pool_genesis_txn_path)})
     print(pool_config)
     
 
     # Set protocol version 2 to work with Indy Node 1.4
     await pool.set_protocol_version(PROTOCOL_VERSION)
 
     try:
         await pool.create_pool_ledger_config(pool_name, pool_config)
     except IndyError as ex:
         if ex.error_code == ErrorCode.PoolLedgerConfigAlreadyExistsError:
             pass
     pool_handle = await pool.open_pool_ledger(pool_name, None)
 
     logger.info("==============================")
     logger.info("=== Getting Trust Anchor credentials for app, armor,  and Government  ==")
     logger.info("------------------------------")
 
     logger.info("\"Sovrin Steward\" -> Create wallet")
     steward_wallet_config = json.dumps({"id": "sovrin_steward_wallet"})
     steward_wallet_credentials = json.dumps({"key": "steward_wallet_key"})
     
    #  지갑 만들기 
     try:
         await wallet.create_wallet(steward_wallet_config, steward_wallet_credentials)
     except IndyError as ex:
         if ex.error_code == ErrorCode.WalletAlreadyExistsError:
             pass
    # 지갑 열어서 did와 인증키 저장
     steward_wallet = await wallet.open_wallet(steward_wallet_config, steward_wallet_credentials)
 
     logger.info("\"Sovrin Steward\" -> Create and store in Wallet DID from seed")
     steward_did_info = {'seed': '000000000000000000000000Steward1'}
     (steward_did, steward_key) = await did.create_and_store_my_did(steward_wallet, json.dumps(steward_did_info))
 
     logger.info("==============================")
     logger.info("== Getting Trust Anchor credentials - Government Onboarding  ==")
     logger.info("------------------------------")
 
     government_wallet_config = json.dumps({"id": "government_wallet"})
     government_wallet_credentials = json.dumps({"key": "government_wallet_key"})
     government_wallet, steward_government_key, government_steward_did, government_steward_key, _ \
         = await onboarding(pool_handle, "Sovrin Steward", steward_wallet, steward_did, "Government", None,
                            government_wallet_config, government_wallet_credentials)
 
     logger.info("==============================")
     logger.info("== Getting Trust Anchor credentials - Government getting Verinym  ==")
     logger.info("------------------------------")
 
     government_did = await get_verinym(pool_handle, "Sovrin Steward", steward_wallet, steward_did,
                                        steward_government_key, "Government", government_wallet, government_steward_did,
                                        government_steward_key, 'TRUST_ANCHOR')
     
     logger.info("==============================")
     logger.info("== Getting Trust Anchor credentials - app Onboarding  ==")
     logger.info("------------------------------")
 
     app_wallet_config = json.dumps({"id": "app_wallet"})
     app_wallet_credentials = json.dumps({"key": "app_wallet_key"})
     app_wallet, steward_app_key, app_steward_did, app_steward_key, _ = \
         await onboarding(pool_handle, "Sovrin Steward", steward_wallet, steward_did, "app", None, app_wallet_config,
                          app_wallet_credentials)
 
     logger.info("==============================")
     logger.info("== Getting Trust Anchor credentials - app getting Verinym  ==")
     logger.info("------------------------------")
     
     app_did = await get_verinym(pool_handle, "Sovrin Steward", steward_wallet, steward_did, steward_app_key,
                                   "app", app_wallet, app_steward_did, app_steward_key, 'TRUST_ANCHOR')
 
     logger.info("==============================")
     logger.info("== Getting Trust Anchor credentials - armor Onboarding  ==")
     logger.info("------------------------------")
 
     armor_wallet_config = json.dumps({"id": "armor_wallet"})
     armor_wallet_credentials = json.dumps({"key": "armor_wallet_key"})
     armor_wallet, steward_armor_key, armor_steward_did, armor_steward_key, _ = \
         await onboarding(pool_handle, "Sovrin Steward", steward_wallet, steward_did, "armor", None, armor_wallet_config,
                          armor_wallet_credentials)
 
     logger.info("==============================")
     logger.info("== Getting Trust Anchor credentials - armor getting Verinym  ==")
     logger.info("------------------------------")
 
     armor_did = await get_verinym(pool_handle, "Sovrin Steward", steward_wallet, steward_did, steward_armor_key,
                                  "armor", armor_wallet, armor_steward_did, armor_steward_key, 'TRUST_ANCHOR')
 
    #  logger.info("==============================")
    #  logger.info("== Getting Trust Anchor credentials - Thrift Onboarding  ==")
    #  logger.info("------------------------------")
 
    #  thrift_wallet_config = json.dumps({"id": " thrift_wallet"})
    #  thrift_wallet_credentials = json.dumps({"key": "thrift_wallet_key"})
    #  thrift_wallet, steward_thrift_key, thrift_steward_did, thrift_steward_key, _ = \
    #      await onboarding(pool_handle, "Sovrin Steward", steward_wallet, steward_did, "Thrift", None,
    #                       thrift_wallet_config, thrift_wallet_credentials)
 
    #  logger.info("==============================")
    #  logger.info("== Getting Trust Anchor credentials - Thrift getting Verinym  ==")
    #  logger.info("------------------------------")
 
    #  thrift_did = await get_verinym(pool_handle, "Sovrin Steward", steward_wallet, steward_did, steward_thrift_key,
    #                                 "Thrift", thrift_wallet, thrift_steward_did, thrift_steward_key, 'TRUST_ANCHOR')
 
    #  logger.info("==============================")
    #  logger.info("=== Credential Schemas Setup ==")
    #  logger.info("------------------------------")
 
    #  logger.info("\"Government\" -> Create \"Job-Certificate\" Schema")
    #  (job_certificate_schema_id, job_certificate_schema) = \
    #      await anoncreds.issuer_create_schema(government_did, 'Job-Certificate', '0.2',
    #                                           json.dumps(['first_name', 'last_name', 'salary', 'employee_status',
    #                                                       'experience']))
 
    #  logger.info("\"Government\" -> Send \"Job-Certificate\" Schema to Ledger")
    #  await send_schema(pool_handle, government_wallet, government_did, job_certificate_schema)
    
    # 스키마 생성 및 스키마 노드로 전송
     logger.info("\"Government\" -> Create \"Transcript\" Schema")
     (transcript_schema_id, transcript_schema) = \
         await anoncreds.issuer_create_schema(government_did, 'Transcript', '1.2',
                                              json.dumps(['first_name', 'last_name', 'degree', 'status',
                                                          'year', 'average', 'ssn']))
     logger.info("\"Government\" -> Send \"Transcript\" Schema to Ledger")
     await send_schema(pool_handle, government_wallet, government_did, transcript_schema)
 
     time.sleep(1)  # sleep 1 second before getting schema
 
     logger.info("==============================")
     logger.info("=== app Credential Definition Setup ==")
     logger.info("------------------------------")
 
     logger.info("\"app\" -> Get \"Transcript\" Schema from Ledger")
     (_, transcript_schema) = await get_schema(pool_handle, app_did, transcript_schema_id)

        #Credential 생성
     logger.info("\"app\" -> Create and store in Wallet \"app Transcript\" Credential Definition")
     (app_transcript_cred_def_id, app_transcript_cred_def_json) = \
         await anoncreds.issuer_create_and_store_credential_def(app_wallet, app_did, transcript_schema,
                                                                'TAG1', 'CL', '{"support_revocation": false}')
 
     logger.info("\"app\" -> Send  \"app Transcript\" Credential Definition to Ledger")
     await send_cred_def(pool_handle, app_wallet, app_did, app_transcript_cred_def_json)
 
     logger.info("==============================")
     logger.info("=== armor Credential Definition Setup ==")
     logger.info("------------------------------")
 
    #  logger.info("\"armor\" -> Get from Ledger \"Job-Certificate\" Schema")
    #  (_, job_certificate_schema) = await get_schema(pool_handle, armor_did, job_certificate_schema_id)
 
    #  logger.info("\"armor\" -> Create and store in Wallet \"armor Job-Certificate\" Credential Definition")
    #  (armor_job_certificate_cred_def_id, armor_job_certificate_cred_def_json) = \
    #      await anoncreds.issuer_create_and_store_credential_def(armor_wallet, armor_did, job_certificate_schema,
    #                                                             'TAG1', 'CL', '{"support_revocation": false}')
 
    #  logger.info("\"armor\" -> Send \"armor Job-Certificate\" Credential Definition to Ledger")
    #  await send_cred_def(pool_handle, armor_wallet, armor_did, armor_job_certificate_cred_def_json)
 
     logger.info("==============================")
     logger.info("=== Getting Transcript with app ==")
     logger.info("==============================")
     logger.info("== Getting Transcript with app - Onboarding ==")
     logger.info("------------------------------")
 
     man_wallet_config = json.dumps({"id": " man_wallet"})
     man_wallet_credentials = json.dumps({"key": "man_wallet_key"})
     man_wallet, app_man_key, man_app_did, man_app_key, app_man_connection_response \
         = await onboarding(pool_handle, "app", app_wallet, app_did, "man", None, man_wallet_config,
                            man_wallet_credentials)
 
     logger.info("==============================")
     logger.info("== Getting Transcript with app - Getting Transcript Credential ==")
     logger.info("------------------------------")
 
     logger.info("\"app\" -> Create \"Transcript\" Credential Offer for man")
     transcript_cred_offer_json = \
         await anoncreds.issuer_create_credential_offer(app_wallet, app_transcript_cred_def_id)
 
     logger.info("\"app\" -> Get key for man did")
     man_app_verkey = await did.key_for_did(pool_handle, armor_wallet, app_man_connection_response['did'])
 
     logger.info("\"app\" -> Authcrypt \"Transcript\" Credential Offer for man")
     authcrypted_transcript_cred_offer = await crypto.auth_crypt(app_wallet, app_man_key, man_app_verkey,
                                                                 transcript_cred_offer_json.encode('utf-8'))
 
     logger.info("\"app\" -> Send authcrypted \"Transcript\" Credential Offer to man")
 
     logger.info("\"man\" -> Authdecrypted \"Transcript\" Credential Offer from app")
     app_man_verkey, authdecrypted_transcript_cred_offer_json, authdecrypted_transcript_cred_offer = \
         await auth_decrypt(man_wallet, man_app_key, authcrypted_transcript_cred_offer)
 
     logger.info("\"man\" -> Create and store \"man\" Master Secret in Wallet")
     man_master_secret_id = await anoncreds.prover_create_master_secret(man_wallet, None)
 
     logger.info("\"man\" -> Get \"app Transcript\" Credential Definition from Ledger")
     (app_transcript_cred_def_id, app_transcript_cred_def) = \
         await get_cred_def(pool_handle, man_app_did, authdecrypted_transcript_cred_offer['cred_def_id'])
 
    # vc 생성 요청에 필요한 데이터를 획득한 사용자가 api를 통해 주어진 credential offer에 대한 VC발급 요청 데이터를 생성하여 발행인에게 전송
     logger.info("\"man\" -> Create \"Transcript\" Credential Request for app")
     (transcript_cred_request_json, transcript_cred_request_metadata_json) = \
         await anoncreds.prover_create_credential_req(man_wallet, man_app_did,
                                                      authdecrypted_transcript_cred_offer_json,
                                                      app_transcript_cred_def, man_master_secret_id)
 
     logger.info("\"man\" -> Authcrypt \"Transcript\" Credential Request for app")
     authcrypted_transcript_cred_request = await crypto.auth_crypt(man_wallet, man_app_key, app_man_verkey,
                                                                   transcript_cred_request_json.encode('utf-8'))
 
     logger.info("\"man\" -> Send authcrypted \"Transcript\" Credential Request to app")
 
     logger.info("\"app\" -> Authdecrypt \"Transcript\" Credential Request from man")
     man_app_verkey, authdecrypted_transcript_cred_request_json, _ = \
         await auth_decrypt(app_wallet, app_man_key, authcrypted_transcript_cred_request)
 
     logger.info("\"app\" -> Create \"Transcript\" Credential for man")
     transcript_cred_values = json.dumps({
         "first_name": {"raw": "man", "encoded": "1139481716457488690172217916278103335"},
         "last_name": {"raw": "Garcia", "encoded": "5321642780241790123587902456789123452"},
         "degree": {"raw": "Bachelor of Science, Marketing", "encoded": "12434523576212321"},
         "status": {"raw": "graduated", "encoded": "2213454313412354"},
         "ssn": {"raw": "123-45-6789", "encoded": "3124141231422543541"},
         "year": {"raw": "2015", "encoded": "2015"},
         "average": {"raw": "5", "encoded": "5"}
     })
 
    # vc 생성후 사용자에게 전달
     transcript_cred_json, _, _ = \
         await anoncreds.issuer_create_credential(app_wallet, transcript_cred_offer_json,
                                                  authdecrypted_transcript_cred_request_json,
                                                  transcript_cred_values, None, None)
 
     logger.info("\"app\" -> Authcrypt \"Transcript\" Credential for man")
     authcrypted_transcript_cred_json = await crypto.auth_crypt(app_wallet, app_man_key, man_app_verkey,
                                                                transcript_cred_json.encode('utf-8'))
 
     logger.info("\"app\" -> Send authcrypted \"Transcript\" Credential to man")
 
     logger.info("\"man\" -> Authdecrypted \"Transcript\" Credential from app")
     _, authdecrypted_transcript_cred_json, _ = \
         await auth_decrypt(man_wallet, man_app_key, authcrypted_transcript_cred_json)
 
    # vc를 지갑에 저장
     logger.info("\"man\" -> Store \"Transcript\" Credential from app")
     await anoncreds.prover_store_credential(man_wallet, None, transcript_cred_request_metadata_json,
                                             authdecrypted_transcript_cred_json, app_transcript_cred_def, None)
 
     logger.info("==============================")
     logger.info("=== Apply for the job with armor ==")
     logger.info("==============================")
     logger.info("== Apply for the job with armor - Onboarding ==")
     logger.info("------------------------------")
 
     man_wallet, armor_man_key, man_armor_did, man_armor_key, armor_man_connection_response = \
         await onboarding(pool_handle, "armor", armor_wallet, armor_did, "man", man_wallet, man_wallet_config,
                          man_wallet_credentials)
 
     logger.info("==============================")
     logger.info("== Apply for the job with armor - Transcript proving ==")
     logger.info("------------------------------")
 
     logger.info("vp 검증 (1)proof request 생성하여 사용자에게 전송")

     logger.info("\"armor\" -> Create \"Job-Application\" Proof Request")
     job_application_proof_request_json = json.dumps({
         'nonce': '1432422343242122312411212',
         'name': 'Job-Application',
         'version': '0.1',
         'requested_attributes': {
             'attr1_referent': {
                 'name': 'first_name'
             },
             'attr2_referent': {
                 'name': 'last_name'
             },
             'attr3_referent': {
                 'name': 'degree',
                 'restrictions': [{'cred_def_id': app_transcript_cred_def_id}]
             },
             'attr4_referent': {
                 'name': 'status',
                 'restrictions': [{'cred_def_id': app_transcript_cred_def_id}]
             },
             'attr5_referent': {
                 'name': 'ssn',
                 'restrictions': [{'cred_def_id': app_transcript_cred_def_id}]
             },
             'attr6_referent': {
                 'name': 'phone_number'
             }
         },
         'requested_predicates': {
             'predicate1_referent': {
                 'name': 'average',
                 'p_type': '>=',
                 'p_value': 4,
                 'restrictions': [{'cred_def_id': app_transcript_cred_def_id}]
             }
         }
     })
 
     logger.info("\"armor\" -> Get key for man did")
     man_armor_verkey = await did.key_for_did(pool_handle, armor_wallet, armor_man_connection_response['did'])
 
     logger.info("\"armor\" -> Authcrypt \"Job-Application\" Proof Request for man")
     authcrypted_job_application_proof_request_json = \
         await crypto.auth_crypt(armor_wallet, armor_man_key, man_armor_verkey,
                                 job_application_proof_request_json.encode('utf-8'))
 
     logger.info("\"armor\" -> Send authcrypted \"Job-Application\" Proof Request to man")
 
     logger.info("\"man\" -> Authdecrypt \"Job-Application\" Proof Request from armor")
     armor_man_verkey, authdecrypted_job_application_proof_request_json, _ = \
         await auth_decrypt(man_wallet, man_armor_key, authcrypted_job_application_proof_request_json)
 
     logger.info("\"man\" -> Get credentials for \"Job-Application\" Proof Request")
 
    # proof_request 에 해당되는 값 확보
     search_for_job_application_proof_request = \
         await anoncreds.prover_search_credentials_for_proof_req(man_wallet,
                                                                 authdecrypted_job_application_proof_request_json, None)
 
     cred_for_attr1 = await get_credential_for_referent(search_for_job_application_proof_request, 'attr1_referent')
     cred_for_attr2 = await get_credential_for_referent(search_for_job_application_proof_request, 'attr2_referent')
     cred_for_attr3 = await get_credential_for_referent(search_for_job_application_proof_request, 'attr3_referent')
     cred_for_attr4 = await get_credential_for_referent(search_for_job_application_proof_request, 'attr4_referent')
     cred_for_attr5 = await get_credential_for_referent(search_for_job_application_proof_request, 'attr5_referent')
     cred_for_predicate1 = \
         await get_credential_for_referent(search_for_job_application_proof_request, 'predicate1_referent')
 
     await anoncreds.prover_close_credentials_search_for_proof_req(search_for_job_application_proof_request)
 
     creds_for_job_application_proof = {cred_for_attr1['referent']: cred_for_attr1,
                                        cred_for_attr2['referent']: cred_for_attr2,
                                        cred_for_attr3['referent']: cred_for_attr3,
                                        cred_for_attr4['referent']: cred_for_attr4,
                                        cred_for_attr5['referent']: cred_for_attr5,
                                        cred_for_predicate1['referent']: cred_for_predicate1}
 
     schemas_json, cred_defs_json, revoc_states_json = \
         await prover_get_entities_from_ledger(pool_handle, man_app_did, creds_for_job_application_proof, 'man')
    # proof가 요구하는 vp생성 및 전달
     logger.info("\"man\" -> Create \"Job-Application\" Proof")
     job_application_requested_creds_json = json.dumps({
         'self_attested_attributes': {
             'attr1_referent': 'man',
             'attr2_referent': 'Garcia',
             'attr6_referent': '123-45-6789'
         },
         'requested_attributes': {
             'attr3_referent': {'cred_id': cred_for_attr3['referent'], 'revealed': True},
             'attr4_referent': {'cred_id': cred_for_attr4['referent'], 'revealed': True},
             'attr5_referent': {'cred_id': cred_for_attr5['referent'], 'revealed': True},
         },
         'requested_predicates': {'predicate1_referent': {'cred_id': cred_for_predicate1['referent']}}
     })
 
     job_application_proof_json = \
         await anoncreds.prover_create_proof(man_wallet, authdecrypted_job_application_proof_request_json,
                                             job_application_requested_creds_json, man_master_secret_id,
                                             schemas_json, cred_defs_json, revoc_states_json)
 
     logger.info("\"man\" -> Authcrypt \"Job-Application\" Proof for armor")
     authcrypted_job_application_proof_json = await crypto.auth_crypt(man_wallet, man_armor_key, armor_man_verkey,
                                                                      job_application_proof_json.encode('utf-8'))
 
     logger.info("\"man\" -> Send authcrypted \"Job-Application\" Proof to armor")
 
     logger.info("\"armor\" -> Authdecrypted \"Job-Application\" Proof from man")
     _, decrypted_job_application_proof_json, decrypted_job_application_proof = \
         await auth_decrypt(armor_wallet, armor_man_key, authcrypted_job_application_proof_json)
 
     schemas_json, cred_defs_json, revoc_ref_defs_json, revoc_regs_json = \
         await verifier_get_entities_from_ledger(pool_handle, armor_did,
                                                 decrypted_job_application_proof['identifiers'], 'armor')
    # 사용자로부터 수신받은 vp값
     logger.info("\"armor\" -> Verify \"Job-Application\" Proof from man")
     assert 'Bachelor of Science, Marketing' == \
            decrypted_job_application_proof['requested_proof']['revealed_attrs']['attr3_referent']['raw']
     assert 'graduated' == \
            decrypted_job_application_proof['requested_proof']['revealed_attrs']['attr4_referent']['raw']
     assert '123-45-6789' == \
            decrypted_job_application_proof['requested_proof']['revealed_attrs']['attr5_referent']['raw']
 
     assert 'man' == decrypted_job_application_proof['requested_proof']['self_attested_attrs']['attr1_referent']
     assert 'Garcia' == decrypted_job_application_proof['requested_proof']['self_attested_attrs']['attr2_referent']
     assert '123-45-6789' == decrypted_job_application_proof['requested_proof']['self_attested_attrs']['attr6_referent']
    
    #  vp를 받은 검증자는 vd 내 포함된 vc와 관련된 스키마 , credential definition을 블록체인으로부터 가져오고, api를 통해 vp검증
     assert await anoncreds.verifier_verify_proof(job_application_proof_request_json,
                                                  decrypted_job_application_proof_json,
                                                  schemas_json, cred_defs_json, revoc_ref_defs_json, revoc_regs_json)







    #  logger.info("==============================")
    #  logger.info("== Apply for the job with armor - Getting Job-Certificate Credential ==")
    #  logger.info("------------------------------")
 
    #  logger.info("\"armor\" -> Create \"Job-Certificate\" Credential Offer for man")
    #  job_certificate_cred_offer_json = \
    #      await anoncreds.issuer_create_credential_offer(armor_wallet, armor_job_certificate_cred_def_id)
 
    #  logger.info("\"armor\" -> Get key for man did")
    #  man_armor_verkey = await did.key_for_did(pool_handle, armor_wallet, armor_man_connection_response['did'])
 
    #  logger.info("\"armor\" -> Authcrypt \"Job-Certificate\" Credential Offer for man")
    #  authcrypted_job_certificate_cred_offer = await crypto.auth_crypt(armor_wallet, armor_man_key, man_armor_verkey,
    #                                                                   job_certificate_cred_offer_json.encode('utf-8'))
 
    #  logger.info("\"armor\" -> Send authcrypted \"Job-Certificate\" Credential Offer to man")
 
    #  logger.info("\"man\" -> Authdecrypted \"Job-Certificate\" Credential Offer from armor")
    #  armor_man_verkey, authdecrypted_job_certificate_cred_offer_json, authdecrypted_job_certificate_cred_offer = \
    #      await auth_decrypt(man_wallet, man_armor_key, authcrypted_job_certificate_cred_offer)
 
    #  logger.info("\"man\" -> Get \"armor Job-Certificate\" Credential Definition from Ledger")
    #  (_, armor_job_certificate_cred_def) = \
    #      await get_cred_def(pool_handle, man_armor_did, authdecrypted_job_certificate_cred_offer['cred_def_id'])
 
    #  logger.info("\"man\" -> Create and store in Wallet \"Job-Certificate\" Credential Request for armor")
    #  (job_certificate_cred_request_json, job_certificate_cred_request_metadata_json) = \
    #      await anoncreds.prover_create_credential_req(man_wallet, man_armor_did,
    #                                                   authdecrypted_job_certificate_cred_offer_json,
    #                                                   armor_job_certificate_cred_def, man_master_secret_id)
 
    #  logger.info("\"man\" -> Authcrypt \"Job-Certificate\" Credential Request for armor")
    #  authcrypted_job_certificate_cred_request_json = \
    #      await crypto.auth_crypt(man_wallet, man_armor_key, armor_man_verkey,
    #                              job_certificate_cred_request_json.encode('utf-8'))
 
    #  logger.info("\"man\" -> Send authcrypted \"Job-Certificate\" Credential Request to armor")
 
    #  logger.info("\"armor\" -> Authdecrypt \"Job-Certificate\" Credential Request from man")
    #  man_armor_verkey, authdecrypted_job_certificate_cred_request_json, _ = \
    #      await auth_decrypt(armor_wallet, armor_man_key, authcrypted_job_certificate_cred_request_json)
 
    #  logger.info("\"armor\" -> Create \"Job-Certificate\" Credential for man")
    #  man_job_certificate_cred_values_json = json.dumps({
    #      "first_name": {"raw": "man", "encoded": "245712572474217942457235975012103335"},
    #      "last_name": {"raw": "Garcia", "encoded": "312643218496194691632153761283356127"},
    #      "employee_status": {"raw": "Permanent", "encoded": "2143135425425143112321314321"},
    #      "salary": {"raw": "2400", "encoded": "2400"},
    #      "experience": {"raw": "10", "encoded": "10"}
    #  })
 
    #  job_certificate_cred_json, _, _ = \
    #      await anoncreds.issuer_create_credential(armor_wallet, job_certificate_cred_offer_json,
    #                                               authdecrypted_job_certificate_cred_request_json,
    #                                               man_job_certificate_cred_values_json, None, None)
 
    #  logger.info("\"armor\" -> Authcrypt \"Job-Certificate\" Credential for man")
    #  authcrypted_job_certificate_cred_json = \
    #      await crypto.auth_crypt(armor_wallet, armor_man_key, man_armor_verkey,
    #                              job_certificate_cred_json.encode('utf-8'))
 
    #  logger.info("\"armor\" -> Send authcrypted \"Job-Certificate\" Credential to man")
 
    #  logger.info("\"man\" -> Authdecrypted \"Job-Certificate\" Credential from armor")
    #  _, authdecrypted_job_certificate_cred_json, _ = \
    #      await auth_decrypt(man_wallet, man_armor_key, authcrypted_job_certificate_cred_json)
 
    #  logger.info("\"man\" -> Store \"Job-Certificate\" Credential")
    #  await anoncreds.prover_store_credential(man_wallet, None, job_certificate_cred_request_metadata_json,
    #                                          authdecrypted_job_certificate_cred_json,
    #                                          armor_job_certificate_cred_def_json, None)
 
    #  logger.info("==============================")
    #  logger.info("=== Apply for the loan with Thrift ==")
    #  logger.info("==============================")
    #  logger.info("== Apply for the loan with Thrift - Onboarding ==")
    #  logger.info("------------------------------")
 
    #  _, thrift_man_key, man_thrift_did, man_thrift_key, \
    #  thrift_man_connection_response = await onboarding(pool_handle, "Thrift", thrift_wallet, thrift_did, "man",
    #                                                      man_wallet, man_wallet_config, man_wallet_credentials)
 
    #  logger.info("==============================")
    #  logger.info("== Apply for the loan with Thrift - Job-Certificate proving  ==")
    #  logger.info("------------------------------")
 
    #  logger.info("\"Thrift\" -> Create \"Loan-Application-Basic\" Proof Request")
    #  apply_loan_proof_request_json = json.dumps({
    #      'nonce': '123432421212',
    #      'name': 'Loan-Application-Basic',
    #      'version': '0.1',
    #      'requested_attributes': {
    #          'attr1_referent': {
    #              'name': 'employee_status',
    #              'restrictions': [{'cred_def_id': armor_job_certificate_cred_def_id}]
    #          }
    #      },
    #      'requested_predicates': {
    #          'predicate1_referent': {
    #              'name': 'salary',
    #              'p_type': '>=',
    #              'p_value': 2000,
    #              'restrictions': [{'cred_def_id': armor_job_certificate_cred_def_id}]
    #          },
    #          'predicate2_referent': {
    #              'name': 'experience',
    #              'p_type': '>=',
    #              'p_value': 1,
    #              'restrictions': [{'cred_def_id': armor_job_certificate_cred_def_id}]
    #          }
    #      }
    #  })
 
    #  logger.info("\"Thrift\" -> Get key for man did")
    #  man_thrift_verkey = await did.key_for_did(pool_handle, thrift_wallet, thrift_man_connection_response['did'])
 
    #  logger.info("\"Thrift\" -> Authcrypt \"Loan-Application-Basic\" Proof Request for man")
    #  authcrypted_apply_loan_proof_request_json = \
    #      await crypto.auth_crypt(thrift_wallet, thrift_man_key, man_thrift_verkey,
    #                              apply_loan_proof_request_json.encode('utf-8'))
 
    #  logger.info("\"Thrift\" -> Send authcrypted \"Loan-Application-Basic\" Proof Request to man")
 
    #  logger.info("\"man\" -> Authdecrypt \"Loan-Application-Basic\" Proof Request from Thrift")
    #  thrift_man_verkey, authdecrypted_apply_loan_proof_request_json, _ = \
    #      await auth_decrypt(man_wallet, man_thrift_key, authcrypted_apply_loan_proof_request_json)
 
    #  logger.info("\"man\" -> Get credentials for \"Loan-Application-Basic\" Proof Request")
 
    #  search_for_apply_loan_proof_request = \
    #      await anoncreds.prover_search_credentials_for_proof_req(man_wallet,
    #                                                              authdecrypted_apply_loan_proof_request_json, None)
 
    #  cred_for_attr1 = await get_credential_for_referent(search_for_apply_loan_proof_request, 'attr1_referent')
    #  cred_for_predicate1 = await get_credential_for_referent(search_for_apply_loan_proof_request, 'predicate1_referent')
    #  cred_for_predicate2 = await get_credential_for_referent(search_for_apply_loan_proof_request, 'predicate2_referent')
 
    #  await anoncreds.prover_close_credentials_search_for_proof_req(search_for_apply_loan_proof_request)
 
    #  creds_for_apply_loan_proof = {cred_for_attr1['referent']: cred_for_attr1,
    #                                cred_for_predicate1['referent']: cred_for_predicate1,
    #                                cred_for_predicate2['referent']: cred_for_predicate2}
 
    #  schemas_json, cred_defs_json, revoc_states_json = \
    #      await prover_get_entities_from_ledger(pool_handle, man_thrift_did, creds_for_apply_loan_proof, 'man')
 
    #  logger.info("\"man\" -> Create \"Loan-Application-Basic\" Proof")
    #  apply_loan_requested_creds_json = json.dumps({
    #      'self_attested_attributes': {},
    #      'requested_attributes': {
    #          'attr1_referent': {'cred_id': cred_for_attr1['referent'], 'revealed': True}
    #      },
    #      'requested_predicates': {
    #          'predicate1_referent': {'cred_id': cred_for_predicate1['referent']},
    #          'predicate2_referent': {'cred_id': cred_for_predicate2['referent']}
    #      }
    #  })
    #  man_apply_loan_proof_json = \
    #      await anoncreds.prover_create_proof(man_wallet, authdecrypted_apply_loan_proof_request_json,
    #                                          apply_loan_requested_creds_json, man_master_secret_id, schemas_json,
    #                                          cred_defs_json, revoc_states_json)
 
    #  logger.info("\"man\" -> Authcrypt \"Loan-Application-Basic\" Proof for Thrift")
    #  authcrypted_man_apply_loan_proof_json = \
    #      await crypto.auth_crypt(man_wallet, man_thrift_key, thrift_man_verkey,
    #                              man_apply_loan_proof_json.encode('utf-8'))
 
    #  logger.info("\"man\" -> Send authcrypted \"Loan-Application-Basic\" Proof to Thrift")
 
    #  logger.info("\"Thrift\" -> Authdecrypted \"Loan-Application-Basic\" Proof from man")
    #  _, authdecrypted_man_apply_loan_proof_json, authdecrypted_man_apply_loan_proof = \
    #      await auth_decrypt(thrift_wallet, thrift_man_key, authcrypted_man_apply_loan_proof_json)
 
    #  logger.info("\"Thrift\" -> Get Schemas, Credential Definitions and Revocation Registries from Ledger"
    #              " required for Proof verifying")
 
    #  schemas_json, cred_defs_json, revoc_defs_json, revoc_regs_json = \
    #      await verifier_get_entities_from_ledger(pool_handle, thrift_did,
    #                                              authdecrypted_man_apply_loan_proof['identifiers'], 'Thrift')
 
    #  logger.info("\"Thrift\" -> Verify \"Loan-Application-Basic\" Proof from man")
    #  assert 'Permanent' == \
    #         authdecrypted_man_apply_loan_proof['requested_proof']['revealed_attrs']['attr1_referent']['raw']
 
    #  assert await anoncreds.verifier_verify_proof(apply_loan_proof_request_json,
    #                                               authdecrypted_man_apply_loan_proof_json,
    #                                               schemas_json, cred_defs_json, revoc_defs_json, revoc_regs_json)
 
    #  logger.info("==============================")
 
    #  logger.info("==============================")
    #  logger.info("== Apply for the loan with Thrift - Transcript and Job-Certificate proving  ==")
    #  logger.info("------------------------------")
 
    #  logger.info("\"Thrift\" -> Create \"Loan-Application-KYC\" Proof Request")
    #  apply_loan_kyc_proof_request_json = json.dumps({
    #      'nonce': '123432421212',
    #      'name': 'Loan-Application-KYC',
    #      'version': '0.1',
    #      'requested_attributes': {
    #          'attr1_referent': {'name': 'first_name'},
    #          'attr2_referent': {'name': 'last_name'},
    #          'attr3_referent': {'name': 'ssn'}
    #      },
    #      'requested_predicates': {}
    #  })
 
    #  logger.info("\"Thrift\" -> Get key for man did")
    #  man_thrift_verkey = await did.key_for_did(pool_handle, thrift_wallet, thrift_man_connection_response['did'])
 
    #  logger.info("\"Thrift\" -> Authcrypt \"Loan-Application-KYC\" Proof Request for man")
    #  authcrypted_apply_loan_kyc_proof_request_json = \
    #      await crypto.auth_crypt(thrift_wallet, thrift_man_key, man_thrift_verkey,
    #                              apply_loan_kyc_proof_request_json.encode('utf-8'))
 
    #  logger.info("\"Thrift\" -> Send authcrypted \"Loan-Application-KYC\" Proof Request to man")
 
    #  logger.info("\"man\" -> Authdecrypt \"Loan-Application-KYC\" Proof Request from Thrift")
    #  thrift_man_verkey, authdecrypted_apply_loan_kyc_proof_request_json, _ = \
    #      await auth_decrypt(man_wallet, man_thrift_key, authcrypted_apply_loan_kyc_proof_request_json)
 
    #  logger.info("\"man\" -> Get credentials for \"Loan-Application-KYC\" Proof Request")
 
    #  search_for_apply_loan_kyc_proof_request = \
    #      await anoncreds.prover_search_credentials_for_proof_req(man_wallet,
    #                                                              authdecrypted_apply_loan_kyc_proof_request_json, None)
 
    #  cred_for_attr1 = await get_credential_for_referent(search_for_apply_loan_kyc_proof_request, 'attr1_referent')
    #  cred_for_attr2 = await get_credential_for_referent(search_for_apply_loan_kyc_proof_request, 'attr2_referent')
    #  cred_for_attr3 = await get_credential_for_referent(search_for_apply_loan_kyc_proof_request, 'attr3_referent')
 
    #  await anoncreds.prover_close_credentials_search_for_proof_req(search_for_apply_loan_kyc_proof_request)
 
    #  creds_for_apply_loan_kyc_proof = {cred_for_attr1['referent']: cred_for_attr1,
    #                                    cred_for_attr2['referent']: cred_for_attr2,
    #                                    cred_for_attr3['referent']: cred_for_attr3}
 
    #  schemas_json, cred_defs_json, revoc_states_json = \
    #      await prover_get_entities_from_ledger(pool_handle, man_thrift_did, creds_for_apply_loan_kyc_proof, 'man')
 
    #  logger.info("\"man\" -> Create \"Loan-Application-KYC\" Proof")
 
    #  apply_loan_kyc_requested_creds_json = json.dumps({
    #      'self_attested_attributes': {},
    #      'requested_attributes': {
    #          'attr1_referent': {'cred_id': cred_for_attr1['referent'], 'revealed': True},
    #          'attr2_referent': {'cred_id': cred_for_attr2['referent'], 'revealed': True},
    #          'attr3_referent': {'cred_id': cred_for_attr3['referent'], 'revealed': True}
    #      },
    #      'requested_predicates': {}
    #  })
 
    #  man_apply_loan_kyc_proof_json = \
    #      await anoncreds.prover_create_proof(man_wallet, authdecrypted_apply_loan_kyc_proof_request_json,
    #                                          apply_loan_kyc_requested_creds_json, man_master_secret_id,
    #                                          schemas_json, cred_defs_json, revoc_states_json)
 
    #  logger.info("\"man\" -> Authcrypt \"Loan-Application-KYC\" Proof for Thrift")
    #  authcrypted_man_apply_loan_kyc_proof_json = \
    #      await crypto.auth_crypt(man_wallet, man_thrift_key, thrift_man_verkey,
    #                              man_apply_loan_kyc_proof_json.encode('utf-8'))
 
    #  logger.info("\"man\" -> Send authcrypted \"Loan-Application-KYC\" Proof to Thrift")
 
    #  logger.info("\"Thrift\" -> Authdecrypted \"Loan-Application-KYC\" Proof from man")
    #  _, authdecrypted_man_apply_loan_kyc_proof_json, authdecrypted_man_apply_loan_kyc_proof = \
    #      await auth_decrypt(thrift_wallet, thrift_man_key, authcrypted_man_apply_loan_kyc_proof_json)
 
    #  logger.info("\"Thrift\" -> Get Schemas, Credential Definitions and Revocation Registries from Ledger"
    #              " required for Proof verifying")
 
    #  schemas_json, cred_defs_json, revoc_defs_json, revoc_regs_json = \
    #      await verifier_get_entities_from_ledger(pool_handle, thrift_did,
    #                                              authdecrypted_man_apply_loan_kyc_proof['identifiers'], 'Thrift')
 
    #  logger.info("\"Thrift\" -> Verify \"Loan-Application-KYC\" Proof from man")
    #  assert 'man' == \
    #         authdecrypted_man_apply_loan_kyc_proof['requested_proof']['revealed_attrs']['attr1_referent']['raw']
    #  assert 'Garcia' == \
    #         authdecrypted_man_apply_loan_kyc_proof['requested_proof']['revealed_attrs']['attr2_referent']['raw']
    #  assert '123-45-6789' == \
    #         authdecrypted_man_apply_loan_kyc_proof['requested_proof']['revealed_attrs']['attr3_referent']['raw']
 
    #  assert await anoncreds.verifier_verify_proof(apply_loan_kyc_proof_request_json,
    #                                               authdecrypted_man_apply_loan_kyc_proof_json,
    #                                               schemas_json, cred_defs_json, revoc_defs_json, revoc_regs_json)
 
    #  logger.info("==============================")
 
    #  logger.info(" \"Sovrin Steward\" -> Close and Delete wallet")
    #  await wallet.close_wallet(steward_wallet)
    #  await wallet.delete_wallet(steward_wallet_config, steward_wallet_credentials)
 
    #  logger.info("\"Government\" -> Close and Delete wallet")
    #  await wallet.close_wallet(government_wallet)
    #  await wallet.delete_wallet(government_wallet_config, government_wallet_credentials)
 
    #  logger.info("\"app\" -> Close and Delete wallet")
    #  await wallet.close_wallet(app_wallet)
    #  await wallet.delete_wallet(app_wallet_config, app_wallet_credentials)
 
    #  logger.info("\"armor\" -> Close and Delete wallet")
    #  await wallet.close_wallet(armor_wallet)
    #  await wallet.delete_wallet(armor_wallet_config, armor_wallet_credentials)
 
    #  logger.info("\"Thrift\" -> Close and Delete wallet")
    #  await wallet.close_wallet(thrift_wallet)
    #  await wallet.delete_wallet(thrift_wallet_config, thrift_wallet_credentials)
 
    #  logger.info("\"man\" -> Close and Delete wallet")
    #  await wallet.close_wallet(man_wallet)
    #  await wallet.delete_wallet(man_wallet_config, man_wallet_credentials)
 
    #  logger.info("Close and Delete pool")
    #  await pool.close_pool_ledger(pool_handle)
    #  await pool.delete_pool_ledger_config(pool_name)
 
    #  logger.info("Getting started -> done")


async def onboarding(pool_handle, _from, from_wallet, from_did, to, to_wallet: Optional[str], to_wallet_config: str,
                     to_wallet_credentials: str):
    logger.info("\"{}\" -> Create and store in Wallet \"{} {}\" DID".format(_from, _from, to))
    (from_to_did, from_to_key) = await did.create_and_store_my_did(from_wallet, "{}")

    logger.info("\"{}\" -> Send Nym to Ledger for \"{} {}\" DID".format(_from, _from, to))
    await send_nym(pool_handle, from_wallet, from_did, from_to_did, from_to_key, None)

    logger.info("\"{}\" -> Send connection request to {} with \"{} {}\" DID and nonce".format(_from, to, _from, to))
    connection_request = {
        'did': from_to_did,
        'nonce': 123456789
    }

    if not to_wallet:
        logger.info("\"{}\" -> Create wallet".format(to))
        try:
            await wallet.create_wallet(to_wallet_config, to_wallet_credentials)
        except IndyError as ex:
            if ex.error_code == ErrorCode.PoolLedgerConfigAlreadyExistsError:
                pass
        to_wallet = await wallet.open_wallet(to_wallet_config, to_wallet_credentials)

    logger.info("\"{}\" -> Create and store in Wallet \"{} {}\" DID".format(to, to, _from))
    (to_from_did, to_from_key) = await did.create_and_store_my_did(to_wallet, "{}")

    logger.info("\"{}\" -> Get key for did from \"{}\" connection request".format(to, _from))
    from_to_verkey = await did.key_for_did(pool_handle, to_wallet, connection_request['did'])

    logger.info("\"{}\" -> Anoncrypt connection response for \"{}\" with \"{} {}\" DID, verkey and nonce"
                .format(to, _from, to, _from))
    connection_response = json.dumps({
        'did': to_from_did,
        'verkey': to_from_key,
        'nonce': connection_request['nonce']
    })
    anoncrypted_connection_response = await crypto.anon_crypt(from_to_verkey, connection_response.encode('utf-8'))

    logger.info("\"{}\" -> Send anoncrypted connection response to \"{}\"".format(to, _from))

    logger.info("\"{}\" -> Anondecrypt connection response from \"{}\"".format(_from, to))
    decrypted_connection_response = \
        json.loads((await crypto.anon_decrypt(from_wallet, from_to_key,
                                              anoncrypted_connection_response)).decode("utf-8"))

    logger.info("\"{}\" -> Authenticates \"{}\" by comparision of Nonce".format(_from, to))
    assert connection_request['nonce'] == decrypted_connection_response['nonce']

    logger.info("\"{}\" -> Send Nym to Ledger for \"{} {}\" DID".format(_from, to, _from))
    await send_nym(pool_handle, from_wallet, from_did, to_from_did, to_from_key, None)

    return to_wallet, from_to_key, to_from_did, to_from_key, decrypted_connection_response


async def get_verinym(pool_handle, _from, from_wallet, from_did, from_to_key,
                      to, to_wallet, to_from_did, to_from_key, role):
    logger.info("\"{}\" -> Create and store in Wallet \"{}\" new DID".format(to, to))
    (to_did, to_key) = await did.create_and_store_my_did(to_wallet, "{}")

    logger.info("\"{}\" -> Authcrypt \"{} DID info\" for \"{}\"".format(to, to, _from))
    did_info_json = json.dumps({
        'did': to_did,
        'verkey': to_key
    })
    authcrypted_did_info_json = \
        await crypto.auth_crypt(to_wallet, to_from_key, from_to_key, did_info_json.encode('utf-8'))

    logger.info("\"{}\" -> Send authcrypted \"{} DID info\" to {}".format(to, to, _from))

    logger.info("\"{}\" -> Authdecrypted \"{} DID info\" from {}".format(_from, to, to))
    sender_verkey, authdecrypted_did_info_json, authdecrypted_did_info = \
        await auth_decrypt(from_wallet, from_to_key, authcrypted_did_info_json)

    logger.info("\"{}\" -> Authenticate {} by comparision of Verkeys".format(_from, to, ))
    assert sender_verkey == await did.key_for_did(pool_handle, from_wallet, to_from_did)

    logger.info("\"{}\" -> Send Nym to Ledger for \"{} DID\" with {} Role".format(_from, to, role))
    await send_nym(pool_handle, from_wallet, from_did, authdecrypted_did_info['did'],
                   authdecrypted_did_info['verkey'], role)

    return to_did

# 블록체인에 did를 등록하기 위한 nym 트랜젝션을 생성, 전송
async def send_nym(pool_handle, wallet_handle, _did, new_did, new_key, role):
    nym_request = await ledger.build_nym_request(_did, new_did, new_key, None, role)
    await ledger.sign_and_submit_request(pool_handle, wallet_handle, _did, nym_request)

# vc 스키마 node에 등록
async def send_schema(pool_handle, wallet_handle, _did, schema):
    schema_request = await ledger.build_schema_request(_did, schema)
    await ledger.sign_and_submit_request(pool_handle, wallet_handle, _did, schema_request)

# vc credential node에 등록
async def send_cred_def(pool_handle, wallet_handle, _did, cred_def_json):
    cred_def_request = await ledger.build_cred_def_request(_did, cred_def_json)
    await ledger.sign_and_submit_request(pool_handle, wallet_handle, _did, cred_def_request)

# vp 검증을 위한 스키마 호출
async def get_schema(pool_handle, _did, schema_id):
    get_schema_request = await ledger.build_get_schema_request(_did, schema_id)
    get_schema_response = await ledger.submit_request(pool_handle, get_schema_request)
    return await ledger.parse_get_schema_response(get_schema_response)

# vp 검증을 위한 credential 호출
async def get_cred_def(pool_handle, _did, schema_id):
    get_cred_def_request = await ledger.build_get_cred_def_request(_did, schema_id)
    get_cred_def_response = await ledger.submit_request(pool_handle, get_cred_def_request)
    return await ledger.parse_get_cred_def_response(get_cred_def_response)


async def get_credential_for_referent(search_handle, referent):
    credentials = json.loads(
        await anoncreds.prover_fetch_credentials_for_proof_req(search_handle, referent, 10))
    return credentials[0]['cred_info']


async def prover_get_entities_from_ledger(pool_handle, _did, identifiers, actor):
    schemas = {}
    cred_defs = {}
    rev_states = {}
    for item in identifiers.values():
        logger.info("\"{}\" -> Get Schema from Ledger".format(actor))
        (received_schema_id, received_schema) = await get_schema(pool_handle, _did, item['schema_id'])
        schemas[received_schema_id] = json.loads(received_schema)

        logger.info("\"{}\" -> Get Claim Definition from Ledger".format(actor))
        (received_cred_def_id, received_cred_def) = await get_cred_def(pool_handle, _did, item['cred_def_id'])
        cred_defs[received_cred_def_id] = json.loads(received_cred_def)

        if 'rev_reg_seq_no' in item:
            pass  # TODO Create Revocation States

    return json.dumps(schemas), json.dumps(cred_defs), json.dumps(rev_states)


async def verifier_get_entities_from_ledger(pool_handle, _did, identifiers, actor):
    schemas = {}
    cred_defs = {}
    rev_reg_defs = {}
    rev_regs = {}
    for item in identifiers:
        logger.info("\"{}\" -> Get Schema from Ledger".format(actor))
        (received_schema_id, received_schema) = await get_schema(pool_handle, _did, item['schema_id'])
        schemas[received_schema_id] = json.loads(received_schema)

        logger.info("\"{}\" -> Get Claim Definition from Ledger".format(actor))
        (received_cred_def_id, received_cred_def) = await get_cred_def(pool_handle, _did, item['cred_def_id'])
        cred_defs[received_cred_def_id] = json.loads(received_cred_def)

        if 'rev_reg_seq_no' in item:
            pass  # TODO Get Revocation Definitions and Revocation Registries

    return json.dumps(schemas), json.dumps(cred_defs), json.dumps(rev_reg_defs), json.dumps(rev_regs)


async def auth_decrypt(wallet_handle, key, message):
    from_verkey, decrypted_message_json = await crypto.auth_decrypt(wallet_handle, key, message)
    decrypted_message_json = decrypted_message_json.decode("utf-8")
    decrypted_message = json.loads(decrypted_message_json)
    return from_verkey, decrypted_message_json, decrypted_message


if __name__ == '__main__':
    run_coroutine(run)
    time.sleep(1)  # FIXME waiting for libindy thread complete